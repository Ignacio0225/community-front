
import {useEffect, useState} from "react";
import {Box, Heading, Spinner, VStack, Text, HStack, Button, useDisclosure} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import NewPost from "./NewPost.tsx";


// "TypeScript에 post 데이터의 구조를 알려주는 interface"
interface Post{
    id:number;
    subject:string;
    poster:{name:string};
    created_at:string;
    updated_at:string;
}

export default function PostList(){
    // 게시글 작성을 위한 모달의 useDisclosure
    const{
        isOpen:isUpLoadModalOpen,
        onOpen:onUpLoadModalOpen,
        onClose:onUpLoadModalClose,
    } = useDisclosure();

    // post는 여러개라 리스트 형태기때문에 useState를 리스트 형태로 만들어줌
    const [posts,setPosts] = useState<Post[]>([]);
    // 로딩화면을 주기 위함, 로딩할때 아무 변화가 없으면 오류인지 뭔지 사용자가 혼동이생김
    const [loading,setLoading] = useState(true);
    //page 넘기는 버튼을 만들기 위함
    const [page, setPage] = useState(1);
    // 홈페이지 시작할때 useEffect로 딱 한번 불러오기 위함 (컴포넌트가 처음 렌더링될 때 게시글을 불러옴)
    //useEffect(()=>{},[]) 이렇게하면 딱한번 불러옴useEffect(()=>{},[page]) 이렇게 하면 페이지 변경 가능
    useEffect(()=>{
        // posts api호출
        fetch(`http://localhost:8000/api/v1/posts/?page=${page}`)
            .then(res => res.json())// 응답을 받아와서 json 형태로 파싱

            .then((data)=>{ // 파싱된 데이터를 usePosts에 넣어줌
                setPosts(data);
                setLoading(false); //가져오는게 끝나면 내용을 보여줌
            })
            .catch((err)=>{
                console.error("Error fetching posts...",err); // 에러시 화면에 에러 표시해줌
                setLoading(false); //가져오는게 끝나면 내용을 보여줌
            });
    },[page]);
    return (
        <Box maxW="4xl" mx={"auto"} mt={10}>
            <HStack spacing={4} align={"stretch"}>
                <Heading mb={6}>게시글</Heading>
                <Button
                    colorScheme={'teal'} onClick={onUpLoadModalOpen}>
                    글쓰기
                </Button>
                <NewPost isOpen={isUpLoadModalOpen} onClose={onUpLoadModalClose}  />
            </HStack>
            {loading ? (
                // setLoading 이 true 일때까지는 Spinner(시각효과) 로 로딩중임을 알려줌
                <Spinner/>
            ):(<Box>
                <VStack spacing={4} align={"stretch"}>
                {/*매핑으로 각 리스트를 한번씩 돌아줌 for문 같은거*/}
                {posts.map((post)=>(
                    // {}이 안에 각각 한번씩 돌면서 json에서 데이터를 뽑아옴
                    <Box key={post.id} p={4} borderWidth={1} borderRadius={'lg'}>
                        <Heading size={'md'}><Link to={`/post/${post.id}`}>{post.subject}</Link></Heading>
                        <Text fontSize={'sm'} color={'gray.500'}>
                            {/*poster는 django serializer 때문에 객체로 저장돼있으니 객체로 불러옴*/}
                            {/*toLocaleDateString은 시간 형태의 스트링*/}
                            작성자:{post.poster.name}|작성일:{new Date(post.created_at).toLocaleDateString()}|수정일:{new Date(post.updated_at).toLocaleDateString()}
                        </Text>
                    </Box>
                ))}
            </VStack>
                <HStack spacing={5} mt={6} justify="center">
                {/*함수형 업데이트 방식 prev => prev -1 을 하면 현재 setPage(여기서는기본이 1로설정)에 있는 숫자 -1이 됨*/}
                {/*isDisabled 는 chakra ui에서 사용되는 버튼 비활성화 옵션 page가 1 이하거나 같으면 버튼 비활성화 */}
                <Button onClick={()=>setPage(prev => prev-1)} isDisabled={page<=1}>
                    이전 페이지
                </Button>
                {/*현재 페이지를 보여줌 (현재 page useState를 뜻함)*/}
                <Text>페이지:{page}</Text>
                <Button onClick={()=>setPage(prev => prev+1)}>
                    다음 페이지
                </Button>
            </HStack>
            </Box>)}
        </Box>
    )

}