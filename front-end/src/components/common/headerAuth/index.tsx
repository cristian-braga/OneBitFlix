import { Container, Form, Input } from "reactstrap";
import styles from "./styles.module.scss";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import ReactModal from "react-modal";
import { useRouter } from "next/router";
import profileService from "@/src/services/profileService";

const HeaderAuth = () => {
    const router = useRouter();

    const [modalOpen, setModalOpen] = useState(false);
    const [initials, setInitials] = useState("");
    const [searchName, setSearchName] = useState("");

    useEffect(() => {
        profileService.fetchCurrent().then((user) => {
            const firstNameInitial = user.firstName.slice(0, 1);
            const lastNameInitial = user.lastName.slice(0, 1);

            setInitials(firstNameInitial + lastNameInitial);
        });
    }, []);

    const toggleModal = () => {
        setModalOpen(!modalOpen);
    };

    const handleLogout = () => {
        sessionStorage.clear();

        router.push("/");
    };

    const handleSearch = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        router.push(`search?name=${searchName}`);

        setSearchName("");
    };

    const handleSearchClick = () => {
        router.push(`search?name=${searchName}`);

        setSearchName("");
    };

    return (
        <>
            <Container className={styles.nav}>
                <Link href="/home">
                    <img src="/logoOnebitflix.svg" alt="logoOnebitflix" className={styles.imgLogoNav} />
                </Link>
                <div className="d-flex align-items-center">
                    <Form onSubmit={handleSearch}>
                        <Input type="search" name="search" className={styles.input} placeholder="Pesquisar" value={searchName} onChange={(event) => { setSearchName(event.currentTarget.value.toLowerCase()); }} />
                    </Form>
                    <img src="/homeAuth/iconSearch.svg" alt="lupaHeader" className={styles.searchImg} onClick={handleSearchClick} />
                    <p className={styles.userProfile} onClick={toggleModal}>{initials}</p>
                </div>
            </Container>
            <ReactModal isOpen={modalOpen} onRequestClose={toggleModal} shouldCloseOnEsc={true} className={styles.modal} overlayClassName={styles.overlayModal}>
                <Link href="/profile">
                    <p className={styles.modalLink}>Meus dados</p>
                </Link>
                <p className={styles.modalLink} onClick={handleLogout}>Sair</p>
            </ReactModal>
        </>
    );
};

export default HeaderAuth;
