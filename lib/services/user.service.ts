import { UserRepository } from '@/lib/repositories/ user.repository'

export const UserService = {
    getAllUsers: async () => {
        return UserRepository.findAll();
    },

    createUser: async (name: string, email: string) => {
        const existing = await UserRepository.findByEmail(email);
        if (existing) {
            throw new Error('Email already exists');
        }

        return UserRepository.create(name, email);
    },

    updateUser: async (id: number, name: string, email: string) => {
        return UserRepository.update(id, name, email);
    },

    deleteUser: async (id: number) => {
        return UserRepository.delete(id);
    },
};
