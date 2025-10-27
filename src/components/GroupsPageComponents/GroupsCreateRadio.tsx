type GroupsCreateRadioProps = {
  checked: boolean;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  title: string;
  name: string;
  value: string;
};

const GroupsCreateRadio = ({
  name,
  value,
  checked,
  onChange,
  title,
}: GroupsCreateRadioProps) => {
  return (
    <label className="flex items-center space-x-2">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
      />
      <span>{title}</span>
    </label>
  );
};

export default GroupsCreateRadio;
