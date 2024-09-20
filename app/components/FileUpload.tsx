import React, { useRef, useState } from "react";
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Text,
    useDisclosure,
    VStack,
} from "@chakra-ui/react";
import Upload from "rc-upload";
import { getImageDimensions, handleImageUpload } from "@/utils";

type Props = {
    onUpload: (file: File) => void;
    fieldLabel?: string;
    accept: string;
    buttonText?: string;
    required?: boolean;
    allowErrors?: boolean;
    error?: string;
};

const FileUpload = ({
    onUpload,
    fieldLabel,
    accept,
    buttonText,
    required,
    allowErrors,
    error,
}: Props) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef<HTMLButtonElement>(null);
    const [errorMessage, setErrorMessage] = useState("");

    return (
        <VStack w="full" gap={4}>
            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Add image
                        </AlertDialogHeader>

                        <AlertDialogBody>{errorMessage}</AlertDialogBody>

                        <AlertDialogFooter>
                            <Button colorScheme="blue" onClick={onClose} ml={3}>
                                Ok
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
            <FormControl>
                <FormLabel fontSize="lg" mb={0}>
                    <Flex>
                        <Box>{fieldLabel}</Box>
                        {required && (
                            <Box color="gpRed.500" pl={1}>
                                *
                            </Box>
                        )}
                    </Flex>
                </FormLabel>
                <Upload
                    customRequest={(options) => {
                        getImageDimensions(
                            options.file as File,
                            (dimensions) => {
                                handleImageUpload({
                                    fileSizeLimit: 2,
                                    dimensions,
                                    file: options.file as File,
                                    onError: (errorMessage) => {
                                        setErrorMessage(errorMessage);
                                        onOpen();
                                    },
                                    onSuccess: () => {
                                        onUpload(options.file as File);
                                    },
                                });
                            }
                        );
                    }}
                    accept={accept}
                    style={{
                        width: "200px",
                        height: "50px",
                        border: error ? "2px solid #e53e3e" : "1px solid black",
                        borderRadius: "5px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        cursor: "pointer",
                    }}
                >
                    {buttonText}
                </Upload>
                {allowErrors && (
                    <Box h="16px" mt="8px">
                        <Text color="#e53e3e">{error}</Text>
                    </Box>
                )}
            </FormControl>
        </VStack>
    );
};

export default FileUpload;
