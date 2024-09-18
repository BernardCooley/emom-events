import React from "react";
import { Box, IconButton, Image, SimpleGrid } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { FirebaseImageBlob } from "@/types";

interface Props {
    images: FirebaseImageBlob[];
    onRemove?: (files: FirebaseImageBlob[]) => void;
    columns?: number[];
}

const ImageGrid = ({ images, onRemove, columns = [3] }: Props) => {
    const urls = images.map((file) =>
        URL.createObjectURL(new File([file.blob], file.name))
    );

    return (
        <SimpleGrid columns={columns} gap={4}>
            {urls?.length > 0 &&
                urls?.map((file, index) => (
                    <Box position="relative" key={file}>
                        {onRemove && (
                            <IconButton
                                rounded="full"
                                right={1}
                                top={1}
                                h="28px"
                                w="28px"
                                minW="unset"
                                position="absolute"
                                aria-label="Remove image"
                                icon={<CloseIcon />}
                                onClick={() =>
                                    onRemove(
                                        images.filter(
                                            (img) => img !== images[index]
                                        )
                                    )
                                }
                            />
                        )}
                        <Image src={file} alt="" />
                    </Box>
                ))}
        </SimpleGrid>
    );
};

export default ImageGrid;
