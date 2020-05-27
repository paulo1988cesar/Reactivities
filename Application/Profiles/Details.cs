using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class Details
    {
        public class Query : IRequest<Profile>
        {
            public string Username { get; set; }
        }

        public class Handler : IRequestHandler<Query, Profile>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Profile> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.SingleOrDefaultAsync(c => c.UserName == request.Username);

                Profile profile = new Profile();

                if (user != null)
                {
                    profile.DisplayName = user.DisplayName;
                    profile.Username = user.UserName;
                    profile.Image = user.Photos.FirstOrDefault(c => c.IsMain)?.Url;
                    profile.Photos = user.Photos;
                    profile.Bio = user.Bio;
                }

                return profile;
            }
        }
    }
}