import { Button, Form, FormGroup, Input, Label } from "reactstrap";
import styles from "../../../../styles/profile.module.scss";
import { FormEvent, useEffect, useState } from "react";
import profileService from "@/src/services/profileService";
import ToastComponent from "../../common/toast";

const PasswordForm = () => {
    const [toastIsOpen, setToastIsOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastColor, setToastColor] = useState("");

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    useEffect(() => {
        profileService.fetchCurrent().then((password) => {
            setCurrentPassword(password.currentPassword);

            setNewPassword(password.newPassword);
        });
    }, []);

    const handlePasswordUpdate = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (newPassword !== confirmNewPassword) {
            setToastIsOpen(true);
            setToastColor("bg-danger");
            setToastMessage("Senha e confirmação de senha diferentes");

            setTimeout(() => {
                setToastIsOpen(false);
            }, 1000 * 3);

            return;
        }

        if (currentPassword === newPassword) {
            setToastIsOpen(true);
            setToastColor("bg-danger");
            setToastMessage("A nova senha deve ser diferente da antiga");

            setTimeout(() => {
                setToastIsOpen(false);
            }, 1000 * 3);

            return;
        }

        const res = await profileService.passwordUpdate({ currentPassword, newPassword });

        if (res === 204) {
            setToastIsOpen(true);
            setToastColor("bg-success");
            setToastMessage("Senha alterada com sucesso");

            setTimeout(() => {
                setToastIsOpen(false);
            }, 1000 * 3);

            setCurrentPassword("");
            setNewPassword("");
            setConfirmNewPassword("");
        } else {
            setToastIsOpen(true);
            setToastColor("bg-danger");
            setToastMessage("Senha atual incorreta");

            setTimeout(() => {
                setToastIsOpen(false)
            }, 1000 * 3);
        }
    };

    return (
        <>
            <Form className={styles.form} onSubmit={handlePasswordUpdate}>
                <div className={styles.inputNormalDiv}>
                    <FormGroup>
                        <Label htmlFor="currentPassword" className={styles.label}>SENHA ATUAL</Label>
                        <Input type="password" id="currentPassword" name="currentPassword" className={styles.input} placeholder="*********" minLength={6} maxLength={12} value={currentPassword} required onChange={(event) => { setCurrentPassword(event.currentTarget.value); }} />
                    </FormGroup>
                </div>
                <div className={styles.inputFlexDiv}>
                    <FormGroup>
                        <Label htmlFor="newPassword" className={styles.label}>NOVA SENHA</Label>
                        <Input type="password" id="newPassword" name="newPassword" className={styles.inputFlex} placeholder="*********" minLength={6} maxLength={12} value={newPassword} required onChange={(event) => { setNewPassword(event.currentTarget.value); }} />
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="confirmNewPassword" className={styles.label}>CONFIRMAR NOVA SENHA</Label>
                        <Input type="password" id="confirmNewPassword" name="confirmNewPassword" className={styles.inputFlex} placeholder="*********" minLength={6} maxLength={12} value={confirmNewPassword} required onChange={(event) => { setConfirmNewPassword(event.currentTarget.value); }} />
                    </FormGroup>
                </div>
                <Button type="submit" className={styles.formBtn} outline>SALVAR</Button>
            </Form>
            <ToastComponent color={toastColor} isOpen={toastIsOpen} message={toastMessage} />
        </>
    );
};

export default PasswordForm;
