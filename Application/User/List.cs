using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.User
{
    public class List
    {
         public class Query : IRequest<List<UserList>> { }

        public class Handler : IRequestHandler<Query, List<UserList>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<List<UserList>> Handle(Query request, CancellationToken cancellationToken)
            {
                var users = await _context.Users.ToListAsync();
                
                List<UserList> userLists = new List<UserList>();

                foreach (var item in users)
                {
                    userLists.Add(new UserList 
                    {
                        Id = item.Id,
                        DisplayName = item.DisplayName,
                        Username = item.UserName,
                        Email = item.Email,
                        Status = item.Active ? "Yes" : "No"                         
                    });
                }
                
                return userLists;
            }
        }
    }
}