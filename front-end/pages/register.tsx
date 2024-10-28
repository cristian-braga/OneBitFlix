import HeaderGeneric from "@/src/components/common/headerGeneric";
import styles from "../styles/registerLogin.module.scss";
import Head from "next/head";
import { Button, Container, Form, FormGroup, Input, Label } from "reactstrap";
import Footer from "@/src/components/common/footer";
import { FormEvent, useEffect, useState } from "react";
import authService from "@/src/services/authService";
import { useRouter } from "next/router";
import ToastComponent from "@/src/components/common/toast";

const Register = () => {
    const router = useRouter();

    const [toastIsOpen, setToastIsOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState("");

    useEffect(() => {
        if (sessionStorage.getItem("onebitflix-token")) {
            router.push("/home");
        }
    }, []);

    const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        const firstName = formData.get("firstName")!.toString();
        const lastName = formData.get("lastName")!.toString();
        const phone = formData.get("phone")!.toString();
        const birth = formData.get("birth")!.toString();
        const email = formData.get("email")!.toString();
        const password = formData.get("password")!.toString();
        const confirmPassword = formData.get("confirmPassword")!.toString();

        const params = { firstName, lastName, phone, birth, email, password };

        if (password !== confirmPassword) {
            setToastIsOpen(true);

            setTimeout(() => {
                setToastIsOpen(false)
            }, 1000 * 3);

            setToastMessage("A senha e confirmação de senha são diferentes");

            return;
        }

        const { data, status } = await authService.register(params);

        if (status === 201) {
            router.push("/login?registred=true");
        } else {
            setToastIsOpen(true);

            setTimeout(() => {
                setToastIsOpen(false)
            }, 1000 * 3);

            setToastMessage(data.message);
        }
    };

    return (
        <>
            <Head>
                <title>OneBitFlix: Registro</title>
                <link rel="shortcut icon" href="/favicon.svg" type="image/x-icon" />
                <script src="https://jsuites.net/v4/jsuites.js"></script>
            </Head>
            <main className={styles.main}>
                <HeaderGeneric logoUrl="/" btnUrl="/login" btnContent="Quero fazer login" />
                <Container className="py-5">
                    <p className={styles.formTitle}>Bem-vindo(a) ao OneBitFlix</p>
                    <Form className={styles.form} onSubmit={handleRegister}>
                        <p className="text-center">
                            <strong>Faça a sua conta!</strong>
                        </p>
                        <FormGroup>
                            <Label htmlFor="firstName" className={styles.label}>NOME</Label>
                            <Input type="text" id="firstName" name="firstName" className={styles.inputName} maxLength={20} placeholder="Qual o seu nome?" required />
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="lastName" className={styles.label}>SOBRENOME</Label>
                            <Input type="text" id="lastName" name="lastName" className={styles.inputName} maxLength={20} placeholder="Qual o seu sobrenome?" required />
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="phone" className={styles.label}>WHATSAPP / TELEGRAM</Label>
                            <Input type="tel" id="phone" name="phone" className={styles.input} placeholder="(xx) 9 xxxx-xxxx" data-mask="[-]+55 (00) 0 0000-0000" required />
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="email" className={styles.label}>E-MAIL</Label>
                            <Input type="email" id="email" name="email" className={styles.input} placeholder="Digite o seu e-mail" required />
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="birth" className={styles.label}>DATA DE NASCIMENTO</Label>
                            <Input type="date" id="birth" name="birth" className={styles.input} min="1930-01-01" max="2024-12-21" required />
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="password" className={styles.label}>SENHA</Label>
                            <Input type="password" id="password" name="password" className={styles.input} minLength={6} maxLength={20} placeholder="Digite a sua senha (min: 6 | max: 20)" required />
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="confirmPassword" className={styles.label}>CONFIRME SUA SENHA</Label>
                            <Input type="password" id="confirmPassword" name="confirmPassword" className={styles.input} minLength={6} maxLength={20} placeholder="Confirme a sua senha" required />
                        </FormGroup>
                        <Button type="submit" className={styles.formBtn} outline>CADASTRAR</Button>
                    </Form>
                </Container>
                <Footer />
                <ToastComponent color="bg-danger" isOpen={toastIsOpen} message={toastMessage} />
            </main>
        </>
    )
};

export default Register;
