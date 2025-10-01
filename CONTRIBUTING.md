# Contributing to Connectrix

Thank you for your interest in contributing to Connectrix! We welcome contributions from everyone and are grateful for every pull request.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Development Workflow](#development-workflow)
- [Code Style Guidelines](#code-style-guidelines)
- [Testing](#testing)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Pull Request Process](#pull-request-process)
- [Getting Help](#getting-help)

## 📜 Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment. We expect all contributors to:

- Be respectful and considerate in communication
- Welcome newcomers and help them get started
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards other community members

## 🚀 Getting Started

### Prerequisites

Before contributing, make sure you have:

1. **Node.js** (v18 or higher)
2. **npm** or **yarn** package manager
3. **MongoDB** (local instance or MongoDB Atlas)
4. **Git** for version control
5. A **GitHub account**

### Initial Setup

1. **Fork the repository**
   
   Click the "Fork" button at the top right of the [repository page](https://github.com/Muhammad-Bello-Ibrahim/Connectest).

2. **Clone your fork**

   ```bash
   git clone https://github.com/YOUR-USERNAME/Connectest.git
   cd Connectest
   ```

3. **Add upstream remote**

   ```bash
   git remote add upstream https://github.com/Muhammad-Bello-Ibrahim/Connectest.git
   ```

4. **Install dependencies**

   ```bash
   npm install
   ```

5. **Set up environment variables**

   Create a `.env.local` file with the required environment variables (see README.md).

6. **Run the development server**

   ```bash
   npm run dev
   ```

## 🛠️ How to Contribute

### Types of Contributions

We welcome various types of contributions:

- **🐛 Bug Fixes**: Found a bug? Submit a fix!
- **✨ New Features**: Have an idea? Propose and implement it!
- **📝 Documentation**: Help improve our docs
- **🎨 UI/UX Improvements**: Enhance the user interface
- **♿ Accessibility**: Make the platform more accessible
- **🧪 Tests**: Add or improve test coverage
- **🔧 Refactoring**: Improve code quality

### Finding an Issue

- Browse the [Issues](https://github.com/Muhammad-Bello-Ibrahim/Connectest/issues) page
- Look for issues labeled `good first issue` or `help wanted`
- Comment on an issue to let others know you're working on it

### Proposing New Features

Before starting work on a major feature:

1. Open an issue to discuss the feature
2. Wait for maintainer feedback
3. Get approval before implementing

This helps avoid duplicate work and ensures alignment with project goals.

## 💻 Development Workflow

### 1. Create a Branch

Always create a new branch for your work:

```bash
git checkout -b feature/your-feature-name
```

Branch naming conventions:
- `feature/` - for new features
- `fix/` - for bug fixes
- `docs/` - for documentation changes
- `refactor/` - for code refactoring
- `test/` - for adding tests

### 2. Make Your Changes

- Write clean, readable code
- Follow the code style guidelines (see below)
- Add comments for complex logic
- Update documentation if needed

### 3. Test Your Changes

- Run the development server and test manually
- Ensure existing functionality still works
- Add tests for new features when possible

### 4. Commit Your Changes

Follow our commit message guidelines (see below):

```bash
git add .
git commit -m "feat: add user profile edit feature"
```

### 5. Keep Your Branch Updated

Regularly sync with the upstream repository:

```bash
git fetch upstream
git rebase upstream/main
```

### 6. Push Your Changes

```bash
git push origin feature/your-feature-name
```

### 7. Open a Pull Request

- Go to your fork on GitHub
- Click "New Pull Request"
- Provide a clear title and description
- Link any related issues

## 📐 Code Style Guidelines

### TypeScript/JavaScript

- Use **TypeScript** for type safety
- Follow the existing code structure and patterns
- Use **functional components** with hooks in React
- Prefer **const** over **let**, avoid **var**
- Use **async/await** instead of promises chains

#### Example:

```typescript
// Good ✅
const getUserById = async (id: string): Promise<User> => {
  const user = await User.findById(id);
  return user;
};

// Avoid ❌
function getUserById(id) {
  return User.findById(id).then((user) => {
    return user;
  });
}
```

### React Components

- Use descriptive component names
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use proper prop types with TypeScript

#### Example:

```typescript
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ label, onClick, disabled = false }) => {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
};
```

### CSS/Styling

- Use **Tailwind CSS** utility classes
- Follow mobile-first approach
- Maintain consistency with existing design
- Use CSS variables for theme colors

### File Organization

- Place components in `/components` directory
- API routes go in `/app/api`
- Database models in `/lib/models`
- Utility functions in `/lib/utils.ts`

### Naming Conventions

- **Components**: PascalCase (e.g., `UserProfile.tsx`)
- **Functions**: camelCase (e.g., `getUserData`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)
- **Files**: kebab-case for utilities (e.g., `user-utils.ts`)

## 🧪 Testing

### Running Tests

```bash
npm run test
```

### Writing Tests

- Test files should be named `*.test.js` or `*.test.ts`
- Place test files in the `/test` directory
- Write descriptive test names
- Test both success and error cases

#### Example:

```javascript
describe('User Authentication', () => {
  it('should successfully login with valid credentials', async () => {
    // Test implementation
  });

  it('should reject login with invalid credentials', async () => {
    // Test implementation
  });
});
```

### Manual Testing

Before submitting a PR:

1. Test your changes in the browser
2. Check responsive design on different screen sizes
3. Test with different user roles (Student, Admin, Dean)
4. Verify error handling

## 📝 Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, missing semicolons, etc.)
- **refactor**: Code refactoring without changing functionality
- **test**: Adding or updating tests
- **chore**: Maintenance tasks (dependencies, build config, etc.)

### Examples

```bash
feat(auth): add password reset functionality

fix(clubs): resolve issue with club membership display

docs(readme): update installation instructions

style(dashboard): improve button styling consistency

refactor(api): simplify user registration logic

test(auth): add tests for login endpoint

chore(deps): update dependencies to latest versions
```

## 🔄 Pull Request Process

### Before Submitting

- [ ] Code follows the style guidelines
- [ ] Self-review of your code completed
- [ ] Comments added for complex code
- [ ] Documentation updated if needed
- [ ] No new warnings or errors introduced
- [ ] Manual testing completed

### PR Description Template

When opening a PR, include:

```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Code refactoring

## Testing
Describe how you tested your changes.

## Screenshots (if applicable)
Add screenshots for UI changes.

## Related Issues
Closes #123
```

### Review Process

1. Maintainers will review your PR
2. Address any requested changes
3. Once approved, your PR will be merged
4. Congratulations! 🎉

### After Merge

- Delete your feature branch
- Update your local repository
- Consider tackling another issue

## 💬 Getting Help

### Need Assistance?

We're here to help! Here are ways to get support:

#### 1. GitHub Discussions

For general questions and discussions:
- Go to the [Discussions](https://github.com/Muhammad-Bello-Ibrahim/Connectest/discussions) page
- Search for similar questions
- Start a new discussion if needed

#### 2. GitHub Issues

For bug reports and feature requests:
- Check existing issues first
- Open a new issue with detailed information
- Use issue templates when available

#### 3. Discord/Slack (if available)

Join our community chat for real-time help:
- Link to be added

#### 4. Email

For private inquiries:
- Email: mr.zplux009@gmail.com

### Common Questions

**Q: I'm new to open source. Where do I start?**

A: Start with issues labeled `good first issue`. These are typically smaller, well-defined tasks perfect for beginners.

**Q: How long does PR review take?**

A: We try to review PRs within 3-5 business days. Complex changes may take longer.

**Q: Can I work on multiple issues at once?**

A: We recommend focusing on one issue at a time to maintain quality and avoid merge conflicts.

**Q: What if I can't finish what I started?**

A: No problem! Let us know in the issue, and we can reassign it or help you complete it.

## 🎓 Learning Resources

New to these technologies? Here are some helpful resources:

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [MongoDB Documentation](https://docs.mongodb.com/)

## 🌟 Recognition

Contributors will be acknowledged in:
- Project README
- Release notes
- Contributors page (coming soon)

## 📄 License

By contributing to Connectrix, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to Connectrix! Together, we're building something amazing for the university community.** 🎉
