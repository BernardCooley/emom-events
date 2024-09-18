import React from "react";
import { Box, IconButton, Image, SimpleGrid } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";

interface Props {
    images: string[];
    onRemove?: (files: string[]) => void;
}

const ImageGrid = ({ images, onRemove }: Props) => {
    return (
        <SimpleGrid columns={3} gap={4}>
            {images?.length > 0 &&
                images?.map((file) => (
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
                                        images.filter((img) => img !== file)
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
