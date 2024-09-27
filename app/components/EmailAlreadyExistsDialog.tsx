import React, { forwardRef, LegacyRef, RefObject } from "react";
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Button,
} from "@chakra-ui/react";

type Props = {
    isOpen: boolean;
    onNo: () => void;
    onYes: () => void;
    onClose: () => void;
};

const EmailAlreadyExistsDialog = forwardRef(
    (
        { isOpen, onNo, onYes, onClose }: Props,
        ref: LegacyRef<HTMLButtonElement>
    ) => {
        return (
            <AlertDialog
                closeOnEsc={false}
                closeOnOverlayClick={false}
                isOpen={isOpen}
                leastDestructiveRef={ref as RefObject<HTMLButtonElement>}
                onClose={onClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Email already registered
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            This email address is already registered via a
                            social login. Do you want to continue? Both accounts
                            will be linked and you can sign into your account
                            using both methods.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button
                                colorScheme="red"
                                variant="outline"
                                ref={ref}
                                onClick={onNo}
                            >
                                No
                            </Button>
                            <Button
                                colorScheme="blue"
                                onClick={() => {
                                    onYes();
                                    onClose();
                                }}
                                ml={3}
                            >
                                Yes
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        );
    }
);

export default EmailAlreadyExistsDialog;
