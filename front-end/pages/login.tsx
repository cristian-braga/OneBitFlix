import Head from "next/head";
import styles from "../styles/registerLogin.module.scss";
import HeaderGeneric from "@/src/components/common/headerGeneric";
import { Button, Container, Form, FormGroup, Input, Label } from "reactstrap";
import Footer from "@/src/components/common/footer";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import ToastComponent from "@/src/components/common/toast";
import authService from "@/src/services/authService";

const Login = () => {
    const router = useRouter();

    const [toastIsOpen, setToastIsOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastColor, setToastColor] = useState("");

    useEffect(() => {
        if (sessionStorage.getItem("onebitflix-token")) {
            router.push("/home");
        }
    }, []);

    useEffect(() => {
        const registerSuccess = router.query.registred;

        if (registerSuccess === "true") {
            setToastIsOpen(true);

            setToastColor("bg-success");

            setTimeout(() => {
                setToastIsOpen(false)
            }, 1000 * 3);

            setToastMessage("Cadastro feito com sucesso");
        }
    }, [router.query]);

    const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        const email = formData.get("email")!.toString();
        const password = formData.get("password")!.toString();

        const params = { email, password };

        const { status } = await authService.login(params);

        if (status === 200) {
            router.push("/home");
        } else {
            setToastIsOpen(true);

            setToastColor("bg-danger");

            setTimeout(() => {
                setToastIsOpen(false)
            }, 1000 * 3);

            setToastMessage("Email ou senha incorretos");
        }
    };

    return (
        <>
            <Head>
                <title>OneBitFlix: Login</title>
                <link rel="shortcut icon" href="/favicon.svg" type="image/x-icon" />
            </Head>
            <main className={styles.main}>
                <HeaderGeneric logoUrl="/" btnUrl="/register" btnContent="Quero fazer parte" />
                <Container className="container py-5">
                    <p className={styles.formTitle}>Bem-vindo(a) de volta!</p>
                    <Form className={styles.form} onSubmit={handleLogin}>
                        <p className="text-center">
                            <strong>Bem-vindo(a) ao OneBitFlix!</strong>
                        </p>
                        <FormGroup>
                            <Label htmlFor="email" className={styles.label}>E-MAIL</Label>
                            <Input type="email" id="email" name="email" className={styles.input} placeholder="Qual o seu email?" required />
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="password" className={styles.label}>SENHA</Label>
                            <Input type="password" id="password" name="password" className={styles.input} placeholder="Qual a sua senha?" required />
                        </FormGroup>
                        <Button type="submit" className={styles.formBtn} outline>ENTRAR</Button>
                    </Form>
                </Container>
                <Footer />
                <ToastComponent color={toastColor} isOpen={toastIsOpen} message={toastMessage} />
            </main>
        </>
    );
};

export default Login;
