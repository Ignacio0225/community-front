import Header from "../components/Header.tsx"
import PostList from "../components/PostList.tsx";
import{Box}from "@chakra-ui/react";



export default function Home() {
    return (
        <Box>
            <Header />
            <PostList />
        </Box>
    );
}

