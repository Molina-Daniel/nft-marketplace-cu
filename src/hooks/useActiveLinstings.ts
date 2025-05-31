import { useQuery } from "@tanstack/react-query";

// Interface for the GraphQL response types
interface ItemListed {
  rindexerId: string;
  nftAddress: string;
  tokenId: string;
  price: string;
  seller: string;
  contractAddress: string;
  blockNumber: string;
}

interface ItemBought {
  nftAddress: string;
  tokenId: string;
}

interface ItemCanceled {
  nftAddress: string;
  tokenId: string;
}

// Interface for active listings to be displayed
export interface ActiveListing {
  nftAddress: string;
  tokenId: string;
  price: string;
  seller: string;
  contractAddress: string;
}

const fetchActiveListings = async (): Promise<ActiveListing[]> => {
  // GraphQL queries
  const listedQuery = `
    query GetItemListeds {
      allItemListeds(first: 20, orderBy: TOKEN_ID_ASC) {
        nodes {
          rindexerId
          nftAddress
          tokenId
          price
          seller
          contractAddress
          network
          blockNumber
        }
      }
    }
  `;

  const boughtQuery = `
    query GetItemBoughts {
      allItemBoughts {
        nodes {
          nftAddress
          tokenId
          network
        }
      }
    }
  `;

  const canceledQuery = `
    query GetItemCanceleds {
      allItemCanceleds {
        nodes {
          nftAddress
          tokenId
          network
        }
      }
    }
  `;

  // Fetch all data in parallel
  const [listedRes, boughtRes, canceledRes] = await Promise.all([
    fetch("/api/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: listedQuery }),
    }),
    fetch("/api/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: boughtQuery }),
    }),
    fetch("/api/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: canceledQuery }),
    }),
  ]);

  const listedData = await listedRes.json();
  const boughtData = await boughtRes.json();
  const canceledData = await canceledRes.json();

  const listedItems = listedData.data.allItemListeds.nodes as ItemListed[];
  const boughtItems = boughtData.data.allItemBoughts.nodes as ItemBought[];
  const canceledItems = canceledData.data.allItemCanceleds
    .nodes as ItemCanceled[];
  console.log("listedItems", listedItems);
  console.log("boughtItems", boughtItems);
  console.log("canceledItems", canceledItems);

  // Create sets to quickly check for bought/canceled items
  const boughtSet = new Set(
    boughtItems.map((item) => `${item.nftAddress}-${item.tokenId}`)
  );
  const canceledSet = new Set(
    canceledItems.map((item) => `${item.nftAddress}-${item.tokenId}`)
  );

  // Filter listed items to find active listings (not bought or canceled)
  const activeListings = listedItems.filter((item) => {
    const key = `${item.nftAddress}-${item.tokenId}`;
    return !boughtSet.has(key) && !canceledSet.has(key);
  });

  console.log("activeListings", activeListings);

  return activeListings;
};

export function useActiveListings() {
  return useQuery({
    queryKey: ["activeListings"],
    queryFn: fetchActiveListings,
  });
}
