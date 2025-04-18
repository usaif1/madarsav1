export function getImagekitUrlFromSrc(
  imageSrc: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transformationArray: any,
) {
  const ikOptions = {
    src: imageSrc,
    transformation: transformationArray,
  };
  const imageURL = imagekit.url(ikOptions);

  return imageURL;
}
