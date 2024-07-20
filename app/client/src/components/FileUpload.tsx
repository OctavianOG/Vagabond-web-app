import { useEffect, useState } from "react";
import { BsImages } from "react-icons/bs";
import imageCompression from "browser-image-compression";
import useStore from "../store/store";

type PropsType = {
  maxUploads: number;
  imgSize: number;
  setImagesForm?: React.Dispatch<React.SetStateAction<string[]>>;
  presetImage?: string;
};

const ICON_SIZE = 200;
const BORDER_RADIUS = "50px";
const IMAGE_COMPRESSION_OPTIONS = {
  maxSizeMB: 1, // Maximum file size (in MB) after compression
  maxWidthOrHeight: 800, // Maximum width or height (in pixels) after compression
};

const FileUpload = ({
  maxUploads,
  imgSize,
  setImagesForm,
  presetImage,
}: PropsType) => {
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [images, setImages] = useState<string[]>([]);

  const imageTypeRegex = /image\/(png|jpg|jpeg)/gm;

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const { files } = e.target;
    if (!files) return;

    const filteredImageFiles = Array.from(files).filter((file) =>
      file.type.match(imageTypeRegex)
    );

    if (filteredImageFiles.length) {
      const limitedImageFiles = filteredImageFiles.slice(0, maxUploads);

      const compressedImages = await Promise.all(
        limitedImageFiles.map(compressImage)
      );

      setImageFiles(compressedImages);
    } else {
      alert("Selected images are not of valid type!");
    }
  };

  const compressImage = (imageFile: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      imageCompression(imageFile, IMAGE_COMPRESSION_OPTIONS)
        .then((compressedFile) => {
          resolve(compressedFile as File);
        })
        .catch((error) => {
          console.error("Image compression error:", error);
          reject(error);
        });
    });
  };

  useEffect(() => {
    let isCancelled = false;
    const fileReaders: FileReader[] = [];

    if (imageFiles.length) {
      const promises = imageFiles.map((file) => {
        return new Promise<string>((resolve, reject) => {
          const fileReader = new FileReader();
          fileReaders.push(fileReader);

          fileReader.onload = (e: ProgressEvent<FileReader>) => {
            const { result } = e.target as FileReader;
            if (result) {
              resolve(result as string);
            }
          };

          fileReader.onabort = () => {
            reject(new Error("File reading aborted"));
          };

          fileReader.onerror = () => {
            reject(new Error("Failed to read file"));
          };

          fileReader.readAsDataURL(file);
        });
      });

      Promise.all(promises)
        .then((imageDataUrls) => {
          if (!isCancelled) {
            setImages(imageDataUrls);
            if (setImagesForm) {
              setImagesForm(imageDataUrls);
            }
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }

    return () => {
      isCancelled = true;
      fileReaders.forEach((fileReader) => {
        if (fileReader.readyState === FileReader.LOADING) {
          fileReader.abort();
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageFiles]);
  const store = useStore();
  const { darkMode } = store;

  const renderImages = () => {
    if (images.length > 0) {
      return images.map((image, idx) => (
        <img
          key={idx}
          src={image}
          className={`object-cover sm:h-[200px] sm:w-[200px] lg:h-[500px] lg:w-[500px]`}
          alt={`Image ${idx}`}
        />
      ));
    }
    return null;
  };

  const renderIcons = () => {
    const iconsFields: JSX.Element[] = [];
    for (let i = 0; i < maxUploads; i++) {
      iconsFields.push(
        <BsImages
          className={`m-auto ${darkMode ? "text-white" : "text-black"}`}
          size={ICON_SIZE}
          key={i}
        />
      );
    }
    return iconsFields;
  };

  return (
    <>
      {!images.length ? (
        <div
          className={`grid grid-cols-[repeat(auto-fit,minmax(${imgSize}px,${imgSize}px))] justify-between overflow-hidden ${
            darkMode ? "bg-[#111111]" : "bg-white"
          } `}
        >
          {presetImage ? (
            <img
              className="h-[500px] w-[500px] rounded-3xl object-cover"
              src={presetImage}
              alt="Preset Image"
            />
          ) : (
            renderIcons()
          )}
        </div>
      ) : (
        <div
          className={`grid grid-cols-[repeat(auto-fit,minmax(${imgSize}px,${imgSize}px))] justify-between gap-y-1 overflow-hidden ${
            darkMode ? "bg-[#111111]" : "bg-white"
          } rounded-[${BORDER_RADIUS}]`}
        >
          {renderImages()}
        </div>
      )}
      <div className="col-span-3 py-4">
        <p>
          <input
            className="m-auto flex"
            type="file"
            id="file"
            onChange={handleFileChange}
            accept="image/png, image/jpg, image/jpeg"
            multiple
          />
        </p>
      </div>
    </>
  );
};

export default FileUpload;
