import React from "react";
import {
    HStack,
    Image,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
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

interface Props {
    isOpen: boolean;
    onClose: () => void;
    event: EventDetails;
    eventImage: FirebaseImageBlob | null;
}

const ShareModal = ({ isOpen, onClose, event, eventImage }: Props) => {
    const shareOptions = {
        url: `${process.env.NEXT_PUBLIC_PRODUCTION_URL}/events/${event.id}`,
        quote: `Check out the EMOM event ${event.name} at ${event.venue.name} event on EMOM Events!`,
        hashtag: "#emomevents",
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Share</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack>
                        {eventImage && (
                            <Image src={getUrlFromBlob(eventImage)} />
                        )}
                        <Text>{event.name}</Text>
                        <Text>{event.venue.name}</Text>
                        <Text>{event.venue.city}</Text>
                        <Text>{formatDateTime(event.timeFrom)}</Text>
                    </VStack>
                </ModalBody>
                <ModalFooter>
                    <HStack w="full" justifyContent="space-around">
                        <FacebookShareButton
                            url={shareOptions.url}
                            hashtag={shareOptions.quote}
                        >
                            <FacebookIcon size={54} borderRadius={12} />
                        </FacebookShareButton>
                        <TwitterShareButton
                            url={shareOptions.url}
                            title={shareOptions.quote}
                        >
                            <TwitterIcon size={54} borderRadius={12} />
                        </TwitterShareButton>
                        <WhatsappShareButton
                            url={shareOptions.url}
                            title={shareOptions.quote}
                            separator=":: "
                        >
                            <WhatsappIcon size={54} borderRadius={12} />
                        </WhatsappShareButton>
                        <EmailShareButton
                            url={shareOptions.url}
                            subject={shareOptions.quote}
                            body=""
                        >
                            <EmailIcon size={54} borderRadius={12} />
                        </EmailShareButton>
                    </HStack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ShareModal;
