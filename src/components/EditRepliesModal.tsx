import React, {useEffect, useState} from "react";
import axios from "axios";
import {
    Button,
    FormControl,
    FormLabel,
    Modal,
    ModalBody,
    ModalCloseButton, ModalFooter,
    ModalHeader,
    ModalOverlay, Textarea,
    useToast,ModalContent
} from "@chakra-ui/react";


// 펑션 내부에서 사용할 것들의 인터페이스를 명시적으로 지정해줌
interface EditRepliesModalProps {
    isOpen:boolean,
    onClose:() => void;
    onUpdate: () => void;
    initialReply:string,
    id:number,
    replies_id:number,
}



export default function EditRepliesModal({
    isOpen:isEditReplyOpen,
    onClose:onEditReplyClose,
    onUpdate:onEditUpdate,
    initialReply,
    id,
    replies_id,
    }:EditRepliesModalProps){

    const toast = useToast();
    // initialReply는 부모 컴포넌트에서 부터 받아올거임, 수정 이기때문에 원래 써져있던걸 보여주게 하기 위함
    const [description, setDescription] = useState(initialReply);


    //  외부에서 수정되면 자동으로 리랜더링 하게 해줌 (이 컴포넌트에서는 사실 필요없음)
    useEffect(()=>{
    setDescription(initialReply);
},[initialReply])


    const handlePutReply = async (e:React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("access");
        if (!token) {
            toast({
                title:"로그인하샘",
                status: "warning",
                isClosable: true,
            });
            return;
        }
        try{
            await axios.put(`http://localhost:8000/api/v1/posts/${id}/replies/${replies_id}/`, {
                description: description,
            },{
                headers:{
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
            });
            toast({
                title: "upload success",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            onEditReplyClose();
            onEditUpdate();
        }catch(err){
            toast({
                title: "upload failed",
                status: "error",
                duration: 3000,
                isClosable: true,
            })
        }
    //
    }

    return (
        <Modal isOpen={isEditReplyOpen} onClose={onEditReplyClose}>
            <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>댓글 수정</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        <FormControl>
                            <FormLabel>댓글내용</FormLabel>
                            <Textarea value={description} onChange={e =>setDescription(e.target.value)}></Textarea>
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme={'teal'} mr={3} onClick={handlePutReply}>수정</Button>
                        <Button colorScheme={'red'} mr={3} onClick={onEditReplyClose}>취소</Button>
                    </ModalFooter>
                </ModalContent>
        </Modal>
    )


}