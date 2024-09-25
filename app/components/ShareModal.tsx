import React from "react";
import {
    HStack,
    IconButton,
    Image,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    useToast,
    VStack,
} from "@chakra-ui/react";
import {
    FacebookShareButton,
    FacebookIcon,
    TwitterShareButton,
    TwitterIcon,
    WhatsappShareButton,
    WhatsappIcon,
    EmailShareButton,
    EmailIcon,
} from "next-share";
import { EventDetails, FirebaseImageBlob } from "@/types";
import { formatDateTime, getUrlFromBlob } from "@/utils";
import { FaRegCopy } from "react-icons/fa";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    event: EventDetails;
    eventImage: FirebaseImageBlob | null;
}

const ShareModal = ({ isOpen, onClose, event, eventImage }: Props) => {
    const toast = useToast();
    const shareOptions = {
        url: `${process.env.NEXT_PUBLIC_PRODUCTION_URL}/events/${event.id}`,
        quote: `Check out the EMOM event ${event.name} at ${event.venue.name}, ${event.venue.city} by ${event.promoter.name} on EMOM Events!`,
    };

    const copyText = () => {
        try {
            if (navigator && navigator.clipboard) {
                navigator.clipboard.writeText(shareOptions.url);
            }

            toast({
                title: "Link copied to clipboard",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        } catch (err) {
            toast({
                title: "Failed to copy link to clipboard",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const buttons = [
        {
            container: FacebookShareButton,
            icon: <FacebookIcon size={54} borderRadius={12} />,
            onClick: () => {},
            label: "Facebook",
            props: {
                url: shareOptions.url,
                hashtag: shareOptions.quote,
            },
        },
        {
            container: TwitterShareButton,
            icon: <TwitterIcon size={54} borderRadius={12} />,
            onClick: () => {},
            label: "Twitter",
            props: {
                url: shareOptions.url,
                title: shareOptions.quote,
            },
        },
        {
            container: WhatsappShareButton,
            icon: <WhatsappIcon size={54} borderRadius={12} />,
            onClick: () => {},
            label: "WhatsApp",
            props: {
                url: shareOptions.url,
                title: shareOptions.quote,
                separator: ":: ",
            },
        },
        {
            container: EmailShareButton,
            icon: <EmailIcon size={54} borderRadius={12} />,
            onClick: () => {},
            label: "Email",
            props: {
                url: shareOptions.url,
                subject: shareOptions.quote,
                body: "",
            },
        },
    ];

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Share</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack>
                        {eventImage && (
                            <Image w="300px" src={getUrlFromBlob(eventImage)} />
                        )}
                        <Text fontWeight={700}>{event.name}</Text>
                        <Text>
                            {event.venue.name} - {event.venue.city}
                        </Text>
                        <Text as="i">{formatDateTime(event.timeFrom)}</Text>
                    </VStack>
                </ModalBody>
                <ModalFooter>
                    <HStack
                        alignItems="flex-start"
                        w="full"
                        justifyContent="space-around"
                    >
                        {buttons.map((button) => (
                            <VStack key={button.label} gap={1}>
                                <button.container {...button.props}>
                                    {button.icon}
                                </button.container>
                                <Text fontSize={12}>{button.label}</Text>
                            </VStack>
                        ))}

                        <VStack gap={1}>
                            <IconButton
                                border="1px solid"
                                borderColor="gray.500"
                                rounded={12}
                                w="54px"
                                h="54px"
                                minW="unset"
                                aria-label="Copy link"
                                bg="transparent"
                                _hover={{
                                    color: "gray.900",
                                    bg: "gray.200",
                                    borderColor: "gray.900",
                                }}
                                icon={<FaRegCopy fontSize="38px" />}
                                onClick={copyText}
                            />
                            <Text fontSize={12}>Copy</Text>
                        </VStack>
                    </HStack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ShareModal;
