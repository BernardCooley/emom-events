import React from "react";
import { Box, Flex, FormControl, FormLabel, VStack } from "@chakra-ui/react";
import Upload from "rc-upload";

type Props = {
    onUpload: (file: File) => void;
    fieldLabel?: string;
    accept: string;
    buttonText?: string;
};

const FileUpload = ({ onUpload, fieldLabel, accept, buttonText }: Props) => {
    return (
        <VStack w="full" gap={4}>
            <FormControl>
                <FormLabel fontSize="lg" mb={0}>
                    <Flex>
                        <Box>{fieldLabel}</Box>
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
                        border: "1px solid black",
                        borderRadius: "5px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        cursor: "pointer",
                    }}
                >
                    {buttonText}
                </Upload>
            </FormControl>
        </VStack>
    );
};

export default FileUpload;
