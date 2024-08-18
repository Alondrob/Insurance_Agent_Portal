﻿// <auto-generated />
using System;
using ClaimsManagementService.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace ClaimsManagementService.Migrations
{
    [DbContext(typeof(ClaimsContext))]
    [Migration("20240617003650_InitialCreate")]
    partial class InitialCreate
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.6")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("ClaimsManagementService.Models.Claim", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("CauseOfLoss")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<decimal>("ClaimAmount")
                        .HasColumnType("decimal(18,2)");

                    b.Property<string>("ClaimType")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("DateOfLoss")
                        .HasColumnType("datetime2");

                    b.Property<string>("PolicyNumber")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Status")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Claims");

                    b.HasData(
                        new
                        {
                            Id = 1,
                            CauseOfLoss = "Fire",
                            ClaimAmount = 1000.00m,
                            ClaimType = "Home",
                            DateOfLoss = new DateTime(2024, 6, 16, 0, 0, 0, 0, DateTimeKind.Unspecified),
                            PolicyNumber = "PN12345",
                            Status = "Open"
                        },
                        new
                        {
                            Id = 2,
                            CauseOfLoss = "Flood",
                            ClaimAmount = 1500.00m,
                            ClaimType = "Auto",
                            DateOfLoss = new DateTime(2024, 5, 10, 0, 0, 0, 0, DateTimeKind.Unspecified),
                            PolicyNumber = "PN12346",
                            Status = "Closed"
                        });
                });
#pragma warning restore 612, 618
        }
    }
}
