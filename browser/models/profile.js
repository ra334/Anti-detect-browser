import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Profile extends Model {
    static async createProfile(name, isOpen) {
        return await Profile.create({ name, isOpen });
    }

    static async getProfileById(id) {
        return await Profile.findByPk(id);
    }

    static async updateProfile(id, updates) {
        const profile = await Profile.findByPk(id);
        if (profile) {
            return await profile.update(updates);
        }
        return null;
    }

    static async deleteProfile(id) {
        const profile = await Profile.findByPk(id);
        if (profile) {
            return await profile.destroy();
        }
        return null;
    }
}

Profile.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isOpen: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'Profile',
});

export default Profile;
