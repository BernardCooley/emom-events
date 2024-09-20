import React, { useState } from "react";
import { Center, Image, Skeleton, VStack } from "@chakra-ui/react";
import { FirebaseImageBlob } from "@/types";
import { getUrlFromBlob } from "@/utils";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

interface Props {
    images?: FirebaseImageBlob[];
    factors: {
        largeDesk: number;
        desk: number;
        tab: number;
        mob: number;
    };
    mainImgHeight: number;
    carouselImgHeight: number;
}

const ImageCarousel = ({
    images,
    factors,
    mainImgHeight,
    carouselImgHeight,
}: Props) => {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const responsive = {
        largeDesk: {
            breakpoint: { max: 4000, min: 3000 },
            items:
                (mainImgHeight + carouselImgHeight + 30) / factors.largeDesk -
                0.5,
        },
        desk: {
            breakpoint: { max: 3000, min: 1024 },
            items:
                (mainImgHeight + carouselImgHeight + 30) / factors.desk - 0.5,
        },
        tab: {
            breakpoint: { max: 1024, min: 464 },
            items: (mainImgHeight + carouselImgHeight + 30) / factors.tab - 0.5,
        },
        mob: {
            breakpoint: { max: 464, min: 0 },
            items: (mainImgHeight + carouselImgHeight + 30) / factors.mob - 0.5,
        },
    };

    return (
        <Center mb={6} w={[`${mainImgHeight}px`]}>
            <VStack w="full" h={`${mainImgHeight + carouselImgHeight + 30}px`}>
                <Skeleton
                    isLoaded={images && images.length > 0}
                    w="full"
                    h={`${mainImgHeight}px`}
                />
                <Skeleton
                    isLoaded={images && images.length > 0}
                    w="full"
                    h={`${carouselImgHeight + 30}px`}
                />

                {images && images.length > 0 && (
                    <VStack w="full">
                        <Image
                            boxSize={`${mainImgHeight}px`}
                            objectFit="contain"
                            src={getUrlFromBlob(images[selectedImageIndex])}
                            alt="main image"
                            borderRadius="lg"
                        />

                        <Carousel
                            swipeable={true}
                            draggable={false}
                            responsive={responsive}
                            keyBoardControl={true}
                            customTransition="all .5"
                            transitionDuration={200}
                            containerClass="carousel-container"
                            removeArrowOnDeviceType={["tablet", "mobile"]}
                            itemClass="carousel-item-padding-40-px"
                        >
                            {images &&
                                images?.map((img, index) => (
                                    <Image
                                        _hover={{ cursor: "pointer" }}
                                        onClick={() =>
                                            setSelectedImageIndex(index)
                                        }
                                        boxSize={`${carouselImgHeight}px`}
                                        objectFit="cover"
                                        key={img.name}
                                        src={getUrlFromBlob(img)}
                                        alt={img.name}
                                        borderRadius="lg"
                                    />
                                ))}
                        </Carousel>
                    </VStack>
                )}
            </VStack>
        </Center>
    );
};

export default ImageCarousel;
