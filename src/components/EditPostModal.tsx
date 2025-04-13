
import {
    Button,
    FormControl,
    FormLabel, Input,
    Modal,
    ModalBody,
    ModalCloseButton, ModalFooter,
    ModalHeader,
    ModalOverlay, Textarea,
    useToast,ModalContent
} from "@chakra-ui/react";
import React,{useState, useEffect} from "react";
import axios from "axios";

// props 설정
interface EditPostModalProps {
    // isOpen 외부에서 내부로 값을 전달해줌 (상태값 함수)
    isOpen: boolean;
    onClose: () => void;
    id: number;
    // 이름은 내가 직접 설정가능 외부에서 받아와서 저장해줄 용도
    initialSubject: string;
    initialDescription: string;
    // 업데이트 prop을 만들어줘서 외부에서 axios.put을 실행해주는 함수를 update로 받아올 수 있게 해줌 (콜백함수, 행동 함수)
    onUpdate: () => void;
}



export default function EditPostModal({
                                        isOpen:isEditPostOpen,
                                        onClose:onEditPostClose,
                                        onUpdate:onEditUpdate,
                                        initialSubject,
                                        initialDescription,
                                        id,
                                        }:EditPostModalProps) {

    const [subject, setSubject] = useState(initialSubject);
    const [description, setDescription] = useState(initialDescription);
    const toast = useToast();


    useEffect(() =>  {
        setSubject(initialSubject);
        setDescription(initialDescription);
    //     외부에서 변경시 useEffect를 실행해줌 (여기서는 유저인증이 돼있으니 필요없음(외부에서 변경이불가능함))
    },[initialSubject, initialDescription]);

    // 업데이트 함수 만들기
    const handleUpdate = async (e:React.FormEvent)=>{
        e.preventDefault();
        try {
            // 유저 인증 (로그인 돼있는지만) 동일 유저인지 확인은 어짜피 부모 컴포넌트에서 게시물 작성자와 수정자가 동일해야 수정버튼이 활성화됨
            const token = localStorage.getItem("access");
            if (!token) throw new Error("not logged in");
            await axios.put(`http://localhost:8000/api/v1/posts/${id}/`,{
                subject: subject,
                description: description,
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            });
            toast({
                title:"수정 완료",
                status:"success",
                isClosable: true,
            });
            onEditPostClose();
            // 부모 컴포넌트에 있는 onUpdate를 실행할수 있게 함(콜백)
            onEditUpdate();
        } catch (err) {
            toast({
                title:"수정 실패",
                status:"error",
                isClosable: true,
            });
        }
    };

    return (
        <Modal isOpen={isEditPostOpen} onClose={onEditPostClose}>
            <ModalOverlay />
            <ModalContent>
            <ModalHeader> 게시글 수정 </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <FormControl>
                    <FormLabel>제목</FormLabel>
                    <Input value={subject} onChange={e => setSubject(e.target.value)} />
                </FormControl>
                <FormControl mt={4}>
                    <FormLabel>내용</FormLabel>
                    <Textarea value={description} onChange={e => setDescription(e.target.value)} />
                </FormControl>
            </ModalBody>
            <ModalFooter>
                <Button colorScheme={'teal'} mr={3} onClick={handleUpdate}>
                    수정
                </Button>
                <Button colorScheme={'red'} onClick={onEditPostClose}>
                    취소
                </Button>
            </ModalFooter>
                </ModalContent>
        </Modal>
    )
}