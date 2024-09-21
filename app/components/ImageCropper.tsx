import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Collapse, HStack, Image, VStack } from "@chakra-ui/react";
import { FirebaseImageBlob } from "@/types";
import { dataURItoBlob } from "@/utils";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.min.css";

interface Props {
    onCancel: () => void;
    onSuccess: (file: FirebaseImageBlob) => void;
    image: File | null;
}

const ImageCropper = ({ onSuccess, image, onCancel }: Props) => {
    const imageRef = useRef<HTMLImageElement>(null);
    const [cropper, setCropper] = useState<Cropper | null>(null);

    useEffect(() => {
        if (image && imageRef.current) {
            imageRef.current.scrollIntoView();
            window.scrollTo(0, 0);
            setCropper(
                new Cropper(imageRef.current, {
                    viewMode: 2,
                    dragMode: "move",
                    movable: false,
                    zoomable: false,
                })
            );
        }
    }, [image]);

    const handleCrop = () => {
        const croppedimage = cropper?.getCroppedCanvas().toDataURL("image/png");

        if (croppedimage && image) {
            const croppedImage = {
                blob: dataURItoBlob(croppedimage),
                name: image.name,
            };
            cropper?.destroy();
            onSuccess(croppedImage);
        }
    };

    return (
        <Collapse
            transition={{
                enter: { duration: 0.5 },
                exit: { duration: 0.5 },
            }}
            in={!!image}
        >
            <VStack w="400px" m="auto">
                <Box h="400px">
                    <Image
                        ref={imageRef}
                        src={image ? URL.createObjectURL(image) : ""}
                    />
                </Box>
                <HStack w="full" justifyContent="center" gap={6}>
                    <Button
                        variant="outline"
                        colorScheme="red"
                        onClick={() => {
                            onCancel();
                            cropper?.destroy();
                        }}
                    >
                        Cancel
                    </Button>
                    <Button colorScheme="blue" onClick={handleCrop}>
                        Crop and add
                    </Button>
                </HStack>
            </VStack>
        </Collapse>
    );
};

export default ImageCropper;
