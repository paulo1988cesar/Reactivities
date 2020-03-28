using FluentValidation;

namespace Application.Validators
{
    public static class ValidatorsExtensions
    {
        public static IRuleBuilder<T, string> Password<T>(this IRuleBuilder<T, string> ruldeBuilder)
        {
            var options = ruldeBuilder
                            .NotEmpty()
                            .MinimumLength(6).WithMessage("Password must be at least 6 characters")
                            .Matches("[A-Z]").WithMessage("Password must contain 1 uppercase letter")
                            .Matches("[a-z]").WithMessage("Password must have at leat 1 lowercase letter")
                            .Matches("[0-9]").WithMessage("Password must contain a number")
                            .Matches("[^a-zA-Z0-9]").WithMessage("Password must contain non alphanumeric");

            return options;

        }
    }
}