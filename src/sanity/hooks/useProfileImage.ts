import { useState, useEffect } from 'react';
import { client } from '@/sanity/client'; // Import Sanity client
import imageUrlBuilder from '@sanity/image-url'; // Import image URL builder
import type { ImageUrlBuilder } from '@sanity/image-url/lib/types/builder';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

// Configure image URL builder outside the hook for efficiency
const builder = imageUrlBuilder(client);
function urlFor(source: SanityImageSource): ImageUrlBuilder {
  return builder.image(source);
}

export function useProfileImage() {
  const [profileImage, setProfileImage] = useState<SanityImageSource | null>(null);
  const [loadingImage, setLoadingImage] = useState(true);

  useEffect(() => {
    const fetchImage = async () => {
      setLoadingImage(true);
      try {
        // Fetch only the profileImage field from the first profile document
        const query = `*[_type == "profile"][0]{ profileImage }`;
        const data = await client.fetch<{ profileImage?: SanityImageSource } | null>(query);
        if (data?.profileImage) {
          setProfileImage(data.profileImage);
        } else {
          console.log("No profile image found in Sanity.");
        }
      } catch (err) {
        console.error("Failed to fetch profile image:", err);
      } finally {
        setLoadingImage(false);
      }
    };

    fetchImage();
  }, []); // Empty dependency array means fetch once on mount

  return { profileImage, loadingImage, urlFor };
}