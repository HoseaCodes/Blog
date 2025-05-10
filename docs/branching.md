# Git Branching Strategy for hoseacodes.com

## Overview

This document outlines the Git branching strategy for hoseacodes.com. It provides a structured approach to development, testing, and deployment processes. The strategy ensures code quality, reduces conflicts, and establishes a clear path from development to production.

## Branch Structure

### Core Branches

| Branch Name | Purpose | Environment | Naming Convention |
|-------------|---------|-------------|-------------------|
| **master** | Production-ready code | Production | `master` |
| **release/prep** | Pre-production staging area | Pre-production | `release/prep` |
| **develop/staging** | Integration and testing | Development | `develop/staging` |
| **hotfix/breakfix** | Emergency fixes | N/A | `hotfix/<issue-name>` |

### Supporting Branches

| Branch Type | Purpose | Naming Convention | Lifetime |
|-------------|---------|-------------------|----------|
| **Feature** | New feature development | `feature/<feature-name>` | Temporary |
| **Bugfix** | Non-urgent bug fixes | `bugfix/<bug-name>` | Temporary |

## Workflow Processes

### Standard Feature Development Flow

1. **Create Feature Branch**
   - Branch from: `develop/staging`
   - Naming: `feature/<feature-name>`
   ```bash
   git checkout develop/staging
   git pull
   git checkout -b feature/new-feature
   ```

2. **Develop and Test**
   - Commit changes regularly
   - Keep feature branch updated with `develop/staging`
   ```bash
   git checkout develop/staging
   git pull
   git checkout feature/new-feature
   git merge develop/staging
   ```

3. **Code Review and Integration**
   - Create pull request to `develop/staging`
   - Address review comments
   - Merge to `develop/staging` once approved

4. **Test in Staging Environment**
   - CI/CD pipeline deploys to staging environment
   - Perform integration testing

5. **Promote to Pre-production**
   - Create pull request from `develop/staging` to `release/prep`
   - Merge once approved
   - CI/CD pipeline deploys to pre-production

6. **Final Testing and Release**
   - Perform acceptance testing in pre-production
   - Create pull request from `release/prep` to `master`
   - Merge once approved
   - CI/CD pipeline deploys to production
   - Tag the release on `master`
   ```bash
   git checkout master
   git pull
   git tag -a v1.x.x -m "Release version 1.x.x"
   git push origin v1.x.x
   ```

### Hotfix/Breakfix Flow

1. **Create Hotfix Branch**
   - Branch from: `master`
   - Naming: `hotfix/<issue-name>`
   ```bash
   git checkout master
   git pull
   git checkout -b hotfix/critical-issue
   ```

2. **Fix and Test**
   - Make necessary changes
   - Test thoroughly locally

3. **Merge to Production and Development**
   - Create pull request to `master`
   - Once approved, merge to `master`
   - Create pull request to `develop/staging`
   - Once approved, merge to `develop/staging`
   - Optionally, create pull request to `release/prep` if needed

4. **Deploy and Tag**
   - CI/CD pipeline deploys to production
   - Tag the hotfix on `master`
   ```bash
   git checkout master
   git pull
   git tag -a v1.x.y -m "Hotfix version 1.x.y"
   git push origin v1.x.y
   ```

## Best Practices

### Commit Guidelines

1. **Commit Messages**
   - Use present tense ("Add feature" not "Added feature")
   - First line should be a summary (50 chars or less)
   - Provide detailed description if needed after a blank line
   - Reference issue numbers if applicable
   ```
   Add user authentication feature
   
   - Implement login/logout functionality
   - Add password reset flow
   - Create user session management
   
   Resolves #123
   ```

2. **Commit Frequency**
   - Commit logical chunks of work
   - Avoid combining unrelated changes in a single commit
   - Commit often to prevent loss of work

### Branch Management

1. **Keep Branches Updated**
   - Regularly merge or rebase from parent branch
   - Resolve conflicts promptly

2. **Clean Up Merged Branches**
   - Delete feature branches after merging
   ```bash
   git branch -d feature/completed-feature
   ```

3. **Squash Merging**
   - Use squash merges for feature branches to maintain a clean history in `master`
   ```bash
   git merge --squash feature/new-feature
   git commit -m "Add new-feature functionality"
   ```

## CI/CD Integration

### Automated Testing

- All branches: Unit tests
- `develop/staging`: Integration tests
- `release/prep`: End-to-end tests, performance tests
- `master`: Smoke tests

### Deployment Pipelines

| Branch | Environment | Deployment Trigger |
|--------|-------------|-------------------|
| `develop/staging` | Development | Automatic on merge |
| `release/prep` | Pre-production | Automatic on merge |
| `master` | Production | Automatic on merge |

### Rollback Strategy

1. **Revert Commit**
   ```bash
   git revert <commit-hash>
   ```

2. **Deploy Previous Tag**
   ```bash
   git checkout v1.x.x
   # Deploy from this tag
   ```

## Version Tagging

- Use semantic versioning (MAJOR.MINOR.PATCH)
- Tag all production releases on `master`
- Include release notes with tags

## Visual Workflow Reference

```
feature/branch       hotfix/branch
     |                    |
     v                    v
develop/staging -----> release/prep -----> master
    (Dev)              (Pre-prod)         (Prod)
```

## Migration Plan

1. **Update CI/CD Pipelines**
   - Configure CI/CD to work with the new branch structure
   - Set up appropriate tests and deployments for each environment

2. **Implement Branch Protection Rules**
   - Require pull request reviews before merging
   - Require status checks to pass before merging
   - Enforce branch naming conventions

3. **Training and Documentation**
   - Ensure all team members understand the new workflow
   - Update documentation as needed
   - Schedule a review session after implementation

## Contact

For questions or clarification about this branching strategy, please contact the repository maintainer.