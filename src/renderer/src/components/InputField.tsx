import { DetailedHTMLProps, InputHTMLAttributes } from 'react';

export type InputFieldProps = {
    label: string;
} & DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

export const InputField = ({ label, ...props }: InputFieldProps) => (
    <div>
        <label className="block mb-1">
            {label}
        </label>
        <input
            className="border rounded px-2 py-1 w-full"
            {...props}
        />
    </div>
);
