package com.biblioteca.biblioteca_digital;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import com.biblioteca.biblioteca_digital.model.Livro;
import com.biblioteca.biblioteca_digital.repository.LivroRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class BibliotecaDigitalApplication {

	public static void main(String[] args) {
		SpringApplication.run(BibliotecaDigitalApplication.class, args);
	}

	@Bean
	public CommandLineRunner demo(LivroRepository livroRepository) {
		return args -> {
			System.out.println("Sistema Online");
		};
	}
}