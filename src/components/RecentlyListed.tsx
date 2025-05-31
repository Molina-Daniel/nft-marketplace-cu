import Link from "next/link";
import { useActiveListings } from "@/hooks/useActiveLinstings";
import NFTBox from "./NFTBox";

// Main component that uses the custom hook
export default function RecentlyListedNFTs() {
  const { data: activeListings, isLoading, error } = useActiveListings();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mt-8 text-center">
        <Link
          href="/list-nft"
          className="inline-block py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          List Your NFT
        </Link>
      </div>
      <h2 className="text-2xl font-bold mb-6">Recently Listed NFTs</h2>

      {isLoading && (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading NFTs...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-8">
          <p className="text-red-500">
            Error loading NFTs. Please try again later.
          </p>
        </div>
      )}

      {activeListings && activeListings.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No NFTs are currently listed.</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {activeListings?.map((listing) => (
          <Link
            href={`/buy-nft/${listing.nftAddress.trim()}/${listing.tokenId}`}
            key={`${listing.nftAddress}-${listing.tokenId}`}
            className="block transform transition hover:scale-105"
          >
            <NFTBox
              key={`${listing.nftAddress}-${listing.tokenId}`}
              tokenId={listing.tokenId}
              contractAddress={listing.nftAddress}
              price={listing.price}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
