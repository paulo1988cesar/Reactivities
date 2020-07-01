using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Followers
{
    public class Delete
    {
        public class Command : IRequest
        {
            public string Username { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _context = context;
                _userAccessor = userAccessor;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {

                var oberser = await _context.Users.SingleOrDefaultAsync(c => c.UserName == _userAccessor.GetCurrentUsername());

                var target = await _context.Users.SingleOrDefaultAsync(c => c.UserName == request.Username);

                if (target == null)
                    throw new RestException(HttpStatusCode.NotFound, new { User = "Not Found" });

                var following = await _context.Followings.SingleOrDefaultAsync(c => c.ObserverId == oberser.Id && c.TargetId == target.Id);

                if (following == null)
                    throw new RestException(HttpStatusCode.BadRequest, new { User = "You are not following this user." });

                if (following != null)
                {
                    _context.Followings.Remove(following);
                }

                // handler logic goes here
                var success = await _context.SaveChangesAsync() > 0;

                if (success) return Unit.Value;

                throw new Exception("Problem saving changes");
            }

        }
    }
}