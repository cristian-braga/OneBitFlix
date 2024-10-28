import { Button, Form, FormGroup, Input, Label } from "reactstrap";
import styles from "../../../../styles/profile.module.scss";
import { FormEvent, useEffect, useState } from "react";
import profileService from "@/src/services/profileService";
import ToastComponent from "../../common/toast";
import { useRouter } from "next/router";

const UserForm = () => {
    const router = useRouter();

    const [toastIsOpen, setToastIsOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastColor, setToastColor] = useState("");

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [createdAt, setCreatedAt] = useState("");
    const [initialEmail, setInitialEmail] = useState(email);

    const date = new Date(createdAt);
    const month = date.toLocaleDateString("default", { month: "long" });

    useEffect(() => {
        profileService.fetchCurrent().then((user) => {
            setFirstName(user.firstName);
            setLastName(user.lastName);
            setPhone(user.phone);
            setEmail(user.email);
            setCreatedAt(user.createdAt);
            setInitialEmail(user.email);
        });
    }, []);

    const handleUserUpdate = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const params = { firstName, lastName, phone, email, createdAt };

        const res = await profileService.userUpdate(params);

        if (res === 200) {
            setToastIsOpen(true);
            setToastColor("bg-success");
            setToastMessage("Informações alteradas com sucesso");

            setTimeout(() => {
                setToastIsOpen(false);
            }, 1000 * 3);

            if (email !== initialEmail) {
                sessionStorage.clear();

                router.push("/");
            }
        } else {
            setToastIsOpen(true);
            setToastColor("bg-danger");
            setToastMessage("Você não pode mudar para esse e-mail");

            setTimeout(() => {
                setToastIsOpen(false)
            }, 1000 * 3);
        }
    };

    return (
        <>
            <Form className={styles.form} onSubmit={handleUserUpdate}>
                <div className={styles.formName}>
                    <p className={styles.nameAbbreviation}>
                        {firstName.slice(0, 1)}{lastName.slice(0, 1)}
                    </p>
                    <p className={styles.userName}>{`${firstName} ${lastName}`}</p>
                </div>
                <div className={styles.memberTime}>
                    <img src="/profile/iconUserAccount.svg" alt="iconProfile" className={styles.memberTimeImg} />
                    <p className={styles.memberTimeText}>
                        Membro desde <br /> {`${date.getDate()} de ${month} de ${date.getFullYear()}`}
                    </p>
                </div>
                <hr />
                <div className={styles.inputFlexDiv}>
                    <FormGroup>
                        <Label htmlFor="firstName" className={styles.label}>NOME</Label>
                        <Input type="text" id="firstName" name="firstName" className={styles.inputFlex} maxLength={20} placeholder="Qual o seu nome?" value={firstName} required onChange={(event) => { setFirstName(event.target.value); }} />
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="lastName" className={styles.label}>SOBRENOME</Label>
                        <Input type="text" id="lastName" name="lastName" className={styles.inputFlex} maxLength={20} placeholder="Qual o seu sobrenome?" value={lastName} required onChange={(event) => { setLastName(event.target.value); }} />
                    </FormGroup>
                </div>
                <div className={styles.inputNormalDiv}>
                    <FormGroup>
                        <Label htmlFor="phone" className={styles.label}>WHATSAPP / TELEGRAM</Label>
                        <Input type="tel" id="phone" name="phone" className={styles.input} placeholder="(xx) 9 xxxx-xxxx" value={phone} data-mask="[-]+55 (00) 0 0000-0000" required onChange={(event) => { setPhone(event.target.value); }} />
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="email" className={styles.label}>E-MAIL</Label>
                        <Input type="email" id="email" name="email" className={styles.input} placeholder="Digite o seu e-mail" value={email} required onChange={(event) => { setEmail(event.target.value); }} />
                    </FormGroup>
                    <Button type="submit" className={styles.formBtn} outline>SALVAR</Button>
                </div>
            </Form>
            <ToastComponent color={toastColor} isOpen={toastIsOpen} message={toastMessage} />
        </>
    );
};

export default UserForm;
