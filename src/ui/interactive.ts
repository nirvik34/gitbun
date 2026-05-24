import inquirer from "inquirer";
import clipboard from "clipboardy";

export async function confirmCommit(message: string): Promise<string | null> {
  console.log("\n" + message + "\n");

  const { action } = await inquirer.prompt([
    {
      type: "input",
      name: "action",
      message: "Accept commit? (Y/n/e/c)",
      default: "Y"
    }
  ]);

  const value = action.toLowerCase();

  if (value === "y" || value === "") return message;

  if (value === "e") {
    const { edited } = await inquirer.prompt([
      {
        type: "input",
        name: "edited",
        message: "Edit commit:",
        default: message
      }
    ]);
    return edited;
  }

  if (value === "c") {
    clipboard.writeSync(message);
    console.log("Commit message copied to clipboard.");
    return null;
  }

  return null;
}
