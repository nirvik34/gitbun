import inquirer from "inquirer";

export async function confirmCommit(message: string): Promise<string | null> {
  const { action } = await inquirer.prompt([
    {
      type: "input",
      name: "action",
      message: `${message}\n\nAccept? (Y/n/e)`,
      default: "Y"
    }
  ]);

  const value = action.toLowerCase();

  if (value === "y" || value === "") {
    return message;
  }

  if (value === "e") {
    const { edited } = await inquirer.prompt([
      {
        type: "input",
        name: "edited",
        message: "Edit commit message:",
        default: message
      }
    ]);
    return edited;
  }

  return null;
}
