import Bridge from './bridge';

export const downloadImage = async (imageURL: string): Promise<void> => {
  try {
    const response = await fetch(imageURL);
    const blob: Blob = await response.blob();
    Bridge.callBridgeApi('downloadImage', blob);
  } catch (error) {
    console.error('Fetch failed:', error);
  }
};
