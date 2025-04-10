import {Heading, VStack,Text,Button} from '@chakra-ui/react';
import {Link} from 'react-router-dom';

export default function NotFound () {
    return <VStack
        bgColor={"gray.300"}
        justifyContent={"center"}
        minHeight={"100vh"}>
        <Heading>Page not Found.</Heading>
        <Text>Is seems that you're lost</Text>
        {/*Ling = react dom 링크*/}
        <Link to="/">
            <Button colorScheme={"red"} variant={"link"}>Go home &rarr; </Button>
        </Link>
    </VStack>
};