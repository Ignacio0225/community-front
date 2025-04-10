
import {Box, Heading, Spinner, VStack,Text, Flex} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import {useEffect, useState} from "react";
import Header from "../components/Header.tsx"

export default function Post() {
    interface PostDetail {
        id: number;
        subject: string;
        poster: { name: string };
        description: string;
        created_at: string;
        updated_at: string;
    }

    // url의 파라미터를 id에 담아줌
    const {id} = useParams();
    // PostDetial의 객체를 받기전에 null로 넣어줌 아래에서 받아오지 못했을때 에러를 주기위해 (옵셔널 체이닝)
    const [post, setPost] = useState<PostDetail | null>(null);
    // loading화면을 만들기위함
    const [isLoading, setIsLoading] = useState(true);

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
    }, []);

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
            {/*post가 로딩되지 않았을때는 아래 출력 [isLodaing의 false내부에서 작동중임 햇갈리지마샘]*/}
            </VStack>
            ):(
                <Text color={"red.500"}>게시글을 불러올 수 없습니다.</Text>
            )}

        </Box>
        </Box>

    )
}
