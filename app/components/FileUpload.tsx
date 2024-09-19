import React from "react";
import {
    Box,
    Flex,
    FormControl,
    FormLabel,
    Text,
    VStack,
} from "@chakra-ui/react";
import Upload from "rc-upload";

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
    return (
        <VStack w="full" gap={4}>
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
                        onUpload(options.file as File);
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
