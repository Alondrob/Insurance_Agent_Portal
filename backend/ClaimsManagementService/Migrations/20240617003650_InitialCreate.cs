using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace ClaimsManagementService.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Claims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PolicyNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DateOfLoss = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CauseOfLoss = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ClaimAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ClaimType = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Claims", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "Claims",
                columns: new[] { "Id", "CauseOfLoss", "ClaimAmount", "ClaimType", "DateOfLoss", "PolicyNumber", "Status" },
                values: new object[,]
                {
                    { 1, "Fire", 1000.00m, "Home", new DateTime(2024, 6, 16, 0, 0, 0, 0, DateTimeKind.Unspecified), "PN12345", "Open" },
                    { 2, "Flood", 1500.00m, "Auto", new DateTime(2024, 5, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), "PN12346", "Closed" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Claims");
        }
    }
}
