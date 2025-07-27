import { UserRepository } from '@/lib/repositories/ user.repository'

export const UserService = {
    getAllUsers: async () => {
        return UserRepository.findAll();
    },

    createUser: async (name: string, email: string, password: string, phone: string) => {
        const existing = await UserRepository.findByEmail(email);
        if (existing) {
            throw new Error('Email already exists');
        }

        return UserRepository.create(name, email, password, phone);
    },

    updateUser: async (id: string, name: string, email: string) => {
        return UserRepository.update(id, name, email);
    },

    deleteUser: async (id: string) => {
        return UserRepository.delete(id);
    },

    updateProfilePicture: async (id: string, profilePicture: string | null) => {
        return UserRepository.updateProfilePicture(id, profilePicture);
    },
};
