import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth";
import { userService } from "../services/userService";

export const usersController = {
    show: async (req: AuthenticatedRequest, res: Response) => {
        try {
            const currentUser = req.user!;

            return res.json(currentUser);
        } catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            }
        }
    },

    update: async (req: AuthenticatedRequest, res: Response) => {
        const { id } = req.user!;

        const { firstName, lastName, phone, email, birth } = req.body;

        try {
            const updatedUser = await userService.update(id, {
                firstName,
                lastName,
                phone,
                email,
                birth
            });

            return res.json(updatedUser);
        } catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            }
        }
    },

    updatePassword: async (req: AuthenticatedRequest, res: Response) => {
        const user = req.user!;

        const { currentPassword, newPassword } = req.body;

        user.checkPassword(currentPassword, async (error, isSame) => {
            try {
                if (error) return res.status(400).json({ message: error.message });

                if (!isSame) return res.status(400).json({ message: 'Senha incorreta' });

                await userService.updatePassword(user.id, newPassword);

                return res.status(204).send();
            } catch (error) {
                if (error instanceof Error) {
                    return res.status(400).json({ message: error.message });
                }
            }
        });
    },

    watching: async (req: AuthenticatedRequest, res: Response) => {
        const { id } = req.user!;

        try {
            const watching = await userService.getKeepWatchingList(id);

            return res.json(watching);
        } catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            }
        }
    }
};
