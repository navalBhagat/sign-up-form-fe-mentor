import { useState } from "react";
import "./App.scss";

function App() {
  const [formValues, setFormValues] = useState<FormValues>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormValues>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: validate(name as keyof FormValues, value),
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors = Object.keys(formValues).reduce((acc, field) => {
      const fieldName = field as keyof FormValues;
      acc[fieldName] = validate(fieldName, formValues[fieldName]);
      return acc;
    }, {} as FormValues);

    setErrors(newErrors);

    if (Object.values(newErrors).every((error) => error === "")) {
      setFormValues({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
      });
    }
  };

  return (
    <>
      <header>
        <h1>Learn to code by watching others</h1>
        <p>
          See how experienced developers solve problems in real-time. Watching
          scripted tutorials is great, but understanding how developers think is
          invaluable.
        </p>
      </header>

      <main>
        <aside aria-label="Promotion">
          <p>
            <strong>Try it free 7 days</strong> then $20/mo. thereafter
          </p>
        </aside>
        <form onSubmit={handleSubmit}>
          {["firstName", "lastName", "email", "password"].map((field) => (
            <InputField
              key={field}
              id={field}
              name={field as keyof FormValues}
              value={formValues[field as keyof FormValues]}
              type={
                field === "email"
                  ? "email"
                  : field === "password"
                  ? "password"
                  : "text"
              }
              placeholder={`${formatFieldName(field as keyof FormValues)}`}
              error={errors[field as keyof FormValues]}
              onBlur={handleBlur}
              onChange={handleChange}
            />
          ))}
          <div>
            <button type="submit" aria-describedby="terms">
              CLAIM YOUR FREE TRIAL
            </button>
          </div>
          <p id="terms" role="tooltip">
            By clicking the button, you are agreeing to our{" "}
            <strong>Terms and Services</strong>
          </p>
        </form>
      </main>
    </>
  );
}

export default App;

/* Helpers */

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

type InputFieldProps = {
  id: string;
  name: keyof FormValues;
  value: string;
  type: string;
  placeholder: string;
  error: string;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const InputField = ({
  id,
  name,
  value,
  type,
  placeholder,
  error,
  onBlur,
  onChange,
}: InputFieldProps) => (
  <div className={error ? "invalid" : ""}>
    <input
      className={error ? "invalid" : ""}
      id={id}
      name={name}
      type={type}
      value={value}
      placeholder={placeholder}
      aria-describedby={`${id}Error`}
      onBlur={onBlur}
      onChange={onChange}
    />
    {error && (
      <>
        <span id={`${id}Error`}>{error}</span>
        <img alt="error icon" src="/images/icon-error.svg" />
      </>
    )}
  </div>
);

const validate = (name: keyof FormValues, value: string): string => {
  const formattedName = formatFieldName(name);
  if (value === "") {
    return `${formattedName} cannot be empty`;
  }
  if (name === "email" && !emailRegex.test(value)) {
    return "Looks like this is not an email";
  }
  return "";
};

const formatFieldName = (name: keyof FormValues): string => {
  const fieldNames: { [key in keyof FormValues]: string } = {
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email Address",
    password: "Password",
  };
  return fieldNames[name] || name.charAt(0).toUpperCase() + name.slice(1);
};
