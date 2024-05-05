import type {Meta, StoryObj} from "@storybook/react";
import CheckBox from "./CheckBox";
import "@/assets/styles/inputs.css";

const meta: Meta<typeof CheckBox> = {
	component: CheckBox,
};

export default meta;
type Story = StoryObj<typeof CheckBox>;

export const Storybook: Story = {
	argTypes: {},
	args: {
		elementId: "Input",
		elementLabel: "Input",
	},
	render: ({...args}) => <CheckBox {...args} />,
};
