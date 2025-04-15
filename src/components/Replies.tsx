import {useParams} from "react-router-dom";
import {Box, Heading, Spinner, VStack, Text, Flex, Button, useDisclosure, useToast, HStack,} from "@chakra-ui/react";
import axios from "axios";
import {useEffect, useState} from "react";


export default function Replies(){

    interface ReplyDetail {
        id: number;
        user:{ name: string };
        description: string;
        created_at: string;
        updated_at: string;
    }
    interface User {
        name: string;
    }

const [currentUser,setCurrentUser]=useState<User|null>(null);
const [replies,setReplies]=useState<ReplyDetail[]>([]);

const toast = useToast();

const {id, request_id} = useParams();

// 유저인증 useEffect
    useEffect(() => {
        const token = localStorage.getItem("access");
        if(!token) return;
        axios.get("http://localhost:8000/api/v1/user/me/", {
            headers: { Authorization: `Bearer ${token}` },
        }).then(res=>{
            setCurrentUser(res.data);
        });
    }, []);

    useEffect(()=>{
        const token = localStorage.getItem("access");

            if(!token) throw new Error("No access token");
        axios.get(`http://localhost:8000/api/v1/posts/${id}/replies/`, {
            headers:{
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        })
            .then(res=>{
            setReplies(res.data);
            toast({
            title: "댓글 가져옴",
            status: "success",
            isClosable: true,
        });
        })
            .catch(()=>{
            toast({
                title:"댓글 가져오기 실패",
                status: "error",
                isClosable: true,
            });
        })
    },[id]);

    return (
        <Box pb={3}>
            <VStack spacing={4} align={"stretch"}>
            {replies.map((reply)=>
                <Box key={reply.id} p={4} borderWidth={1} borderRadius={'lg'}>
                <Heading alignItems={'center'} display={'flex'} size={"sm"}>{reply.user.name}</Heading>
                    <Text fontSize={10}>작성:{new Date(reply.created_at).toLocaleDateString()} | 수정:{new Date(reply.created_at).toLocaleDateString()}</Text>
                    <Text>{reply.description}</Text>
                    {reply.user.name === currentUser?.name &&
                    <Flex justifyContent="flex-end">
                    <Button colorScheme={'teal'}>수정</Button>
                    <Button colorScheme={'red'}>수정</Button>
                    </Flex>}
                </Box>)}
            </VStack>
        </Box>
    )
}
