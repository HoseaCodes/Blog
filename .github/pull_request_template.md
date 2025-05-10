# Current Flow (Short-term Fix for Cleanup):
## Feature Branch → Breakfix → Prep → Master
**Feature Branch**: Works as usual for individual feature development.
**Breakfix**: Temporary branch for urgent fixes that may need to be merged into both Staging and Prep.
**Prep**: Acts as a pre-master environment for staging releases and should allow for easy reverts (think of it as a staging area that reflects what will go into Master).
**Master**: Your production-ready branch for hoseacodes.com.
> Merge into Staging after Breakfix:
> 
> This will ensure the changes are tested in the Staging environment first, preventing any conflicts from directly being merged into Master without testing.
Staging should be updated frequently with changes from Prep to ensure it's in sync.

# New Flow (Long-term Strategy):
## Feature Branch → Staging → Prep → Master:
**Feature Branch**: Develop and test individual features.
**Staging**: Collect multiple features for integration and testing.
**Prep**: Can be used for features that need to be finalized or for stabilizing before moving to Master. It's helpful to manage releases in this branch.
**Master**: Production-ready code.

## Pull Request Details
**Source Branch**: <!-- Which branch are you merging from? -->
**Target Branch**: <!-- Which branch are you merging to? -->

## Description
<!-- Provide a brief description of the changes in this PR -->

## Related Issues
<!-- Link any related issues here using #issue-number format -->

## Checklist
- [ ] I have tested these changes locally
- [ ] I have updated documentation if necessary
- [ ] I have followed the branch flow strategy outlined above