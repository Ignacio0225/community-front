import {useParams} from "react-router-dom";
import {
    Box,
    Heading,
    Spinner,
    VStack,
    Text,
    Flex,
    Button,
    useToast,
    Textarea, HStack, useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import React, {useEffect, useState} from "react";
import EditRepliesModal from "./EditRepliesModal.tsx";


export default function Replies() {

    interface ReplyDetail {
        id: number;
        user: { name: string };
        description: string;
        created_at: string;
        updated_at: string;
    }

    interface User {
        name: string;
    }

    const [isLoading, setIsLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [replies, setReplies] = useState<ReplyDetail[]>([]);
    const [description, setDescription] = useState("");
    const [page, setPage] = useState(1);
    const [editingReply, setEditingReply] = useState<ReplyDetail|null>(null);
    const toast = useToast();

    const {id} = useParams();


    const{
        isOpen:isEditReplyOpen,
        onOpen:onEditReplyOpen,
        onClose:onEditReplyClose,
    } = useDisclosure();


    // reply는 ReplyDetail 과같은 객체이다 라는걸알려줌
    const handleEditClick = (reply:ReplyDetail)=>{
        // 받아온 reply를 useState에 저장
        setEditingReply(reply);
        // 모달 오픈
        onEditReplyOpen();
    }

    const handleDeleteClick = (reply:ReplyDetail)=>{
        const confirmDelete = window.confirm("정말 삭제 하시겠습니까?");
            if (!confirmDelete) return;
        handleDeleteReply(reply.id)

    }

    const handleDeleteReply =async (replies_id:number)=>{

        const token = localStorage.getItem("access");
            if (!token) throw new Error("Token is missing");

        try{
            await axios.delete(`http://localhost:8000/api/v1/posts/${id}/replies/${replies_id}/`, {
            headers:{Authorization:`Bearer ${token}`},
        });
            toast({
                title:"deleted",
                status:"success",
                isClosable: true,
            });

            const res = await axios.get(`http://localhost:8000/api/v1/posts/${id}/replies/?page=${page}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        // 리플 삭제후 새로 업데이트된 리스트를 axios.get해서 다시 저장해주기 위함
        setReplies(res.data);

        }catch(err){
            toast({
                title:"error",
                status:"error",
                isClosable: true,
            })
        }
    }

// 유저인증 useEffect
    useEffect(() => {
        const token = localStorage.getItem("access");
        if (!token) return;
        axios.get("http://localhost:8000/api/v1/user/me/", {
            headers: {Authorization: `Bearer ${token}`},
        }).then(res => {
            // 불러온 데이터를 CurrentUser에 저장 이후에 currentUser.name 이런식으로 유저의 이름만 가져올 수 있음
            setCurrentUser(res.data);
        });
    }, []);


    // 댓글 불러오기 (get 일때는 async 를 안써도됨)
    useEffect(() => {
        const token = localStorage.getItem("access");

        if (!token) throw new Error("No access token");
        axios.get(`http://localhost:8000/api/v1/posts/${id}/replies/?page=${page}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                setReplies(res.data);
                // 데이터를 받아서 Replies 에 저장후 setIsLoading 에 false 를 저장해줌 return(보이는화면) 에서 loading중과 아닐때를 구분하기 위함
                setIsLoading(false);
                toast({
                    title: "댓글 가져옴",
                    status: "success",
                    isClosable: true,
                });
            })
            .catch(() => {
                toast({
                    title: "댓글 가져오기 실패",
                    status: "error",
                    isClosable: true,
                });
            })
    }, [id,page]);

    // 댓글 작성(post,put,delete)와 같은 동작에는 async 사용 (백엔드를 사용하면서 시간이 필요하기때문에 다른 기능을 멈출 필요가 있음)
    const handlePostReply = async (e: React.FormEvent) => {
        // 새로고침 방지
        e.preventDefault();

    const token = localStorage.getItem("access");
    // 토큰이 false 면 메세지 전달
    if (!token) {
        toast({
            title: "로그인하샘",
            status: "warning",
            isClosable: true,
        });
        return;
    }
    try {
        await axios.post(`http://localhost:8000/api/v1/posts/${id}/replies/`, {
            // 작성가능한 Json 형태 다른거는 백엔드에서 read_only 라서 쓰면 에러남
            description: description,
        }, {
            headers: {
                // 타입은 Json 형태라고 고지
                "Content-Type": "application/json",
                // 토큰 인증
                Authorization: `Bearer ${token}`
            },
        });
        toast({
            title: "upload success",
            status: "success",
            duration: 3000,
            isClosable: true,
        });
        // 성공시 새로고침 한번
        window.location.reload();
    } catch (err) {
        toast({
            title: "upload failed",
            status: "error",
            duration: 3000,
            isClosable: true,
        })
    }
}




    return (
        // 로딩 true 일때 Spinner
        isLoading ? (<Spinner alignItems={'center'} />
        // 로딩 false 일때 실행
        ):(
            <Box pb={3}>
            <VStack spacing={4} align={"stretch"}>
            {replies.map((reply)=>
                <Box key={reply.id} p={4} borderWidth={1} borderRadius={'lg'}>
                    <Heading alignItems={'center'} display={'flex'} size={"sm"}>
                        {reply.user.name}
                        <Text ml={3} mt={3} fontSize={10}>작성:{new Date(reply.created_at).toLocaleDateString()} | 수정:{new Date(reply.created_at).toLocaleDateString()}</Text>
                    </Heading>
                    <HStack spacing={4} alignItems={'center'} justifyContent={'space-between'} >
                        <Text>{reply.description}</Text>
                        {/*if문 같은거로 생각하면됨 reply...과 current..이 같으면(&&) 다음 실행 */}
                        {reply.user.name === currentUser?.name &&
                        <Box justifyContent={'flex-end'}>
                            <Flex justifyContent="flex-end">
                                <Box key={reply.id}>
                                    {/*맵핑되는 리플라이중 선택된 하나의 리플라이를 handleEditClick으로 보내줌*/}
                                    <Button size={'sm'} colorScheme={'teal'} onClick={()=>handleEditClick(reply)}>수정</Button>
                                </Box>
                                <Button size={'sm'} colorScheme={'red'} onClick={()=>handleDeleteClick(reply)}>삭제</Button>
                            </Flex>
                        </Box>}
                        </HStack>
                </Box>)}
                {/*editingReply에 객체가 들어있으면 true 로서 모달 실행 이미 맵핑을 해서 전달해주기때문에 꼭 맵핑 밖에 존재*/}
                {editingReply && (
                    <EditRepliesModal
                                        isOpen={isEditReplyOpen}
                                        onClose={onEditReplyClose}
                                        initialReply={editingReply.description}
                                        /*이 id는 인터페이스가 아니라 param에서 가져옴 paramd은 string을 전달 하지만 자식 컴포넌트에서
                                        * number로 설정 해놨기때문에 여기서 number로 바꿔줘야함  API <int:pk>의 파라미터를 넣어주기 위함*/
                                        id={Number(id)}
                                        /*자식 컴포넌트에 선택된 reply의 아이디 를 넘겨줌 API의 <int:replies_pk>의 파라미터를 넣어주기 위함*/
                                        replies_id={editingReply.id}
                                        /*수정후 새로고침 해주기 위함*/
                                        onUpdate={()=>{
                                        const token = localStorage.getItem('access');
                                        if (!token) return;
                                        axios.get(`http://localhost:8000/api/v1/posts/${id}/replies/`,{
                                            headers:{
                                                Authorization: `Bearer ${token}`
                                            },
                                        }).then(res => {
                                            setReplies(res.data);
                                        }).catch(()=>{
                                            console.log("업데이트 되지않음.")
                                        })
                                        }

                                        }  />
                )}
            </VStack>
            <Box>
                <Heading alignItems={'center'} display={'flex'} size={'sm'}>
                {/*prev 의 시작은 setPage의 기본값 이라고 생각하면 편함 1 => 1-1 버튼을 누르고부턴 이전값을 기억하고있는거임 */}
                <Button onClick={()=>setPage(prev=>prev-1)} isDisabled={page<=1}>
                    다음 댓글
                </Button>
                    <Text fontSize={'sm'} color={'gray.500'}>페이지:{page}</Text>
                {/*    prev의 마지막 값+1 이라는 의미*/}
                <Button onClick={()=>setPage(prev => prev+1)}>이전 댓글</Button>
                </Heading>
            </Box>
                <Flex justifyContent={'flex-end'} mt={5}>
                <Box borderWidth={3} p={3} w={'full'}>
                    <Textarea rows={5} placeholder={'댓글 작성'} value={description} onChange={(e)=>setDescription(e.target.value)}/>
                    <Flex justifyContent={'flex-end'} mt={5}>
                    <Button onClick={handlePostReply} colorScheme={'teal'} >작성</Button>
                    </Flex>
                </Box>
                </Flex>
        </Box>
            )
    )
}
