using Domain;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Application.User;
using System.Collections.Generic;
using System.Threading;
using MediatR;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers
{
    public class UserController : BaseController
    {
        [HttpGet("list")]
        [Authorize]
        public async Task<ActionResult<List<UserList>>> List(CancellationToken ct)
        {
            return await Mediator.Send(new List.Query(), ct);
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<ActionResult<User>> Login(Login.Query query)
        {
            return await Mediator.Send(query);
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<ActionResult<User>> Register(Register.Command command)
        {
            return await Mediator.Send(command);
        }

        [HttpGet]
        public async Task<ActionResult<User>> CurrentUser()
        {
            return await Mediator.Send(new CurrentUser.Query());
        }

        // [HttpPost]
        // public async Task<ActionResult<uint>> DesactivedUser(Guid id, Edit.Command command)
        // {
        //     return await Mediator.Send(query);
        // }
    }
}