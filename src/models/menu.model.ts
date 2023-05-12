import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
  UUIDV4,
  Sequelize,
} from 'sequelize';

export interface MenuInterface {
  id: string;
  name: string;
  content: string;
}
// order of InferAttributes & InferCreationAttributes is important.
export const Menu:any = (sequelize: Sequelize) => {
  class Menu extends Model<
    InferAttributes<Menu>,
    InferCreationAttributes<Menu>
  > {
    // 'CreationOptional' is a special type that marks the field as optional
    // when creating an instance of the model (such as using Model.create()).
    declare id?: CreationOptional<string>;
    declare name: string;
    declare content?: string;
    declare created_at?: CreationOptional<string>;
    declare updated_at?: CreationOptional<string>;
  }

  Menu.init(
    {
      name: {
        type: new DataTypes.STRING(),
        primaryKey: true,
        allowNull: false,
      },
      content: {
        type: new DataTypes.TEXT(),
        allowNull: false,
      },
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    },
    {
      tableName: 'menus',
      timestamps: false,
      sequelize, // passing the `sequelize` instance is required
    }
  );
  return Menu;
};
