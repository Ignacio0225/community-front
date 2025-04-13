
import {Box, Heading, Spinner, VStack, Text, Flex, Button, useDisclosure, useToast, HStack,} from "@chakra-ui/react";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState,} from "react";
import Header from "../components/Header.tsx"
import EditPostModal from "../components/EditPostModal.tsx";
import axios from "axios";

export default function Post() {
    interface PostDetail {
        id: number;
        subject: string;
        poster: { name: string };
        description: string;
        created_at: string;
        updated_at: string;
    }
    // 유저인증에서 가져온 object 중에 name을 문자열이라고 설정해줌
    interface User {
        name: string;
    }

    const {
        isOpen:isEditPostOpen,
        onOpen:onEditPostOpen,
        onClose:onEditPostClose,
    } =useDisclosure();

    const toast = useToast();

    const navigate = useNavigate();

    // url의 파라미터를 id에 담아줌
    const {id} = useParams();
    // PostDetail의 객체를 받기전에 null로 넣어줌 아래에서 받아오지 못했을때 에러를 주기위해 (옵셔널 체이닝)
    const [post, setPost] = useState<PostDetail | null>(null);
    // loading화면을 만들기위함
    const [isLoading, setIsLoading] = useState(true);
    // 유저인증해서 유저 이름을 저장하기 위함
    const [currentUser, setCurrentUser] = useState<User|null>(null);

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


    useEffect(() => {
        // 유저 인증이 된후 게시물을 볼 수 있게 설정
        const token = localStorage.getItem("access");
        fetch(`http://localhost:8000/api/v1/posts/${id}/`, {
            headers: {Authorization: `Bearer ${token}`,}
        }).then(res => {
            if (!res.ok) {
                throw new Error("not logged in");
            }
            return res.json();
        })
            .then((data) => {
                setPost(data);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error("Error getting post", err);
            });
    }, [id]);

    const handleDelete = async ()=>{
        // 실행 되면 먼저 확인 메세지 실행 window.confirm은 true / false를 반환해줌
        const confirmDelete = window.confirm("정말 삭제 하시겠습니까?");
            if (!confirmDelete) return;

        try{
            const token = localStorage.getItem("access");
        if (!token) throw new Error("not logged in");
        await axios.delete(`http://localhost:8000/api/v1/posts/${id}/`, {
            headers:{
                Authorization: `Bearer ${token}`,
            },
        });
        toast({
            title:"삭제 완료",
            status:"success",
            isClosable: true,
        });
        navigate('/')
        }catch(err){
            toast({
                title:"삭제 실패",
                status:"error",
                isClosable: true,
            })
        }
    }

    return (
        <Box>
            <Flex justify="flex-end" p={4}>
                <Header/>
            </Flex>
            <Box maxW={'4xl'} mx={'auto'} mt={4} borderWidth={"1px"}>
            {/*로딩중(true)일때는 Spinner를 보여줌*/}
            {isLoading ? (
                <Spinner/>
            // 로딩이 완료(false) 됐을때는 원하는대로 출력
            // post가 로딩이 완료 됐으면 밑에 출력 해줌 (아니면에러) [isLodaing의 false내부에서 작동중임 햇갈리지마샘]
            ) : post ? (<VStack spacing={4} align={"stretch"}>
                <Heading borderWidth={"1px"} borderColor={"gray.400"} borderRadius={"md"} mb={2} fontSize={'xl'} fontWeight={'bold'}>{post.subject}</Heading>
                <Box borderWidth={"2px"}>
                    <Box borderWidth={"2px"} mb={4}>
                        <Text fontSize={20}>작성자:{post.poster.name}</Text>
                        <Text fontSize={13}>작성일:{new Date(post.created_at).toLocaleDateString()}</Text>
                        <Text fontSize={13}>수정일:{new Date(post.updated_at).toLocaleDateString()}</Text>
                    </Box>
                    <Heading size={'md'}>내용</Heading>
                    <Text fontSize={'sm'}>{post.description}</Text>
                </Box>
                    {/*작성자와 로그인돼있는 유저의 이름을 비교하여 동일하다면 수정 버튼 출력*/}
                    {post.poster.name === currentUser?.name && (<HStack>
                        <Button colorScheme={'teal'} onClick={onEditPostOpen}>수정</Button>
                        <Button colorScheme={'red'} onClick={handleDelete}>삭제</Button>
                    </HStack>)}
                        <EditPostModal
                        isOpen={isEditPostOpen}
                            onClose={onEditPostClose}
                            id={post.id}
                            initialSubject={post.subject}
                            initialDescription={post.description}
                            /*모달tsx에 안에 있는 onUpdate에 넣어줄 axios.put을 만듬*/
                            onUpdate={()=>{
                                const token=localStorage.getItem('access');
                                axios.get(`http://localhost:8000/api/v1/posts/${id}`,{
                                    headers:{
                                        Authorization:`Bearer ${token}`
                                    }
                                }).then(res => {
                                        setPost(res.data)
                                    }).catch(err=>{
                                        console.error("수정 후 데이터 불러오기 실패",err)
                                })
                            }}
                        />
            {/*post가 로딩되지 않았을때는 아래 출력 [isLodaing의 false내부에서 작동중임 햇갈리지마샘]*/}
            </VStack>
            ):(
                <Text color={"red.500"}>게시글을 불러올 수 없습니다.</Text>
            )}

        </Box>
        </Box>

    )
}
