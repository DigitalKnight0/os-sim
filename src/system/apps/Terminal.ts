import { Process } from '../../types';
import icon from '../../assets/icons/terminal.svg';

const TerminalProcess: Process = {
  config: {
    name: 'Terminal',
    type: 'process',
    icon,// Add your icon path here
    targetVer: '1.0.0'
  },

  run: async (process) => {
    const terminal = await process.loadLibrary('lib/WindowManager').then((wm: any) => {
      return wm.createWindow({
        title: 'Terminal',
        icon,
        width: 500,
        height: 400
      }, process)
    })
    // Declare commandInput variable at the outer scope
    let commandInput: HTMLInputElement;
    const fs = process.fs

    // Define type for command history
    const history: string[] = [];
    let historyIndex: number = -1;

    // Function to create a new command output element
    const createOutputElement = (text: string): HTMLDivElement => {
      const output = document.createElement('div');
      output.textContent = text;
      return output;
    };

    // Function to handle user input
    const handleInput = (event: KeyboardEvent): void => {
      if (event.key === 'Enter') {
        const command = commandInput.value.trim();
        history.push(command);
        historyIndex = -1;
        executeCommand(command);
        commandInput.value = '';
      } else if (event.key === 'ArrowUp') {
        historyIndex = Math.min(historyIndex + 1, history.length - 1);
        commandInput.value = history[historyIndex] || '';
      } else if (event.key === 'ArrowDown') {
        historyIndex = Math.max(historyIndex - 1, -1);
        commandInput.value = history[historyIndex] || '';
      }
    };

    // Function to execute commands
    const executeCommand = (command: string): void => {
      const output = createOutputElement(`$ ${command}`);
      terminal.content.appendChild(output);

      const [cmd, ...args] = command.split(' ');

      switch (cmd) {
        case 'ls':
          ls(args.join(' '));
          break;
        case 'cd':
          cd(args.join(' '));
          break;
        case 'mkdir':
          mkdir(args.join(' '));
          break;
        case 'touch':
          touch(args.join(' '));
          break;
        case 'openFileWindow':
          break;
          break;
        default:
          terminal.content.appendChild(createOutputElement(`Command not found: ${cmd}`));
      }

      printPrompt();
    };

    // Function to list files in the current directory
    const ls = async (path: string): Promise<void> => {
      const directory = resolvePath(path);
      try {
        const files: string[] = await fs.readdir(directory);
        terminal.content.appendChild(createOutputElement(`Listing files in ${directory}`));
        files.forEach(file => {
          terminal.content.appendChild(createOutputElement(file));
        });
      } catch (error) {
        terminal.content.appendChild(createOutputElement(`Error: ${error.message}`));
      }
    };
    // Function to change directory
      const cd = async (path: string): Promise<void> => {
        try {
          const newPath = resolvePath(path);
          const stat = await fs.stat(newPath);
          if (stat.isDirectory()) {
            currentDirectory = newPath;
            terminal.content.appendChild(createOutputElement(`Changed directory to ${newPath}`));
          } else {
            terminal.content.appendChild(createOutputElement(`${newPath} is not a directory`));
          }
        } catch (error) {
          terminal.content.appendChild(createOutputElement(`Error: ${error.message}`));
        }
      };

    // Function to create a new directory
    const mkdir = async (dirname: string): Promise<void> => {
      try {
        const directoryPath = resolvePath(dirname);
        await fs.mkdir(directoryPath);
        terminal.content.appendChild(createOutputElement(`Created directory: ${directoryPath}`));
      } catch (error) {
        terminal.content.appendChild(createOutputElement(`Error: ${error.message}`));
      }
    };

    // Function to create a new file
    const touch = async (filename: string): Promise<void> => {
      try {
        const filePath = resolvePath(filename);
        await fs.writeFile(filePath, '');
        terminal.content.appendChild(createOutputElement(`Created file: ${filePath}`));
      } catch (error) {
        terminal.content.appendChild(createOutputElement(`Error: ${error.message}`));
      }
    };

    // Function to open file management window
    

    // Function to print prompt to the terminal
    const printPrompt = (): void => {
      const prompt = createOutputElement(`${currentDirectory} $ `);
      terminal.content.appendChild(prompt);
    };

    // Function to resolve paths
    const resolvePath = (path: string): string => {
      // Logic to resolve relative paths and validate existence
      if (path) {
        // If the path is absolute (starts with '/'), return it as is
        if (path.startsWith('/')) {
          return path;
        }
        // If the path is relative, join it with the current directory
        return `${currentDirectory}/${path}`;
      }
      // If no path is provided, return the current directory
      return currentDirectory;
    };

    // Create terminal elements
    
    terminal.content.style.width = '80%';
    terminal.content.style.height = '400px';
    terminal.content.style.margin = '20px auto';
    terminal.content.style.padding = '10px';
    terminal.content.style.backgroundColor = 'black';
    terminal.content.style.color = 'white';
    terminal.content.style.fontFamily = 'monospace';
    terminal.content.style.overflowY = 'auto';

    const inputContainer: HTMLDivElement = document.createElement('div');
    inputContainer.id = 'input-container';

    const promptSymbol: HTMLSpanElement = document.createElement('span');
    promptSymbol.textContent = '$';

    commandInput = document.createElement('input');
    commandInput.type = 'text';
    commandInput.autocomplete = 'off';
    commandInput.addEventListener('keydown', handleInput);

    inputContainer.appendChild(promptSymbol);
    inputContainer.appendChild(commandInput);
    terminal.content.appendChild(inputContainer)

    //document.body.appendChild(terminal);
    //document.body.appendChild(inputContainer);

    // Initialize terminal state
    let currentDirectory: string = '/home';

    // Print welcome message and prompt
    terminal.content.appendChild(createOutputElement('Welcome to Terminal App!'));
    printPrompt();
  }
};

export default TerminalProcess;
