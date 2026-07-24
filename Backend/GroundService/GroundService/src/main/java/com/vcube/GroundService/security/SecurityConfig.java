package com.vcube.GroundService.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

	@Autowired
	private JwtFilter jwtFilter;

	@Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> {}) // allow CORS

            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )

//            .authorizeHttpRequests(auth -> auth
//                // Allow CORS preflight requests
//                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
//
//                // Swagger for API docs
//                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
//
//                // PUBLIC endpoint: Home page can fetch all grounds
//                .requestMatchers(HttpMethod.GET, "/api/grounds/getAllGrounds").permitAll()
//
//                // Admin CRUD routes
//                .requestMatchers(HttpMethod.POST, "/api/grounds/**").hasRole("ADMIN")
//                .requestMatchers(HttpMethod.PUT, "/api/grounds/**").hasRole("ADMIN")
//                .requestMatchers(HttpMethod.DELETE, "/api/grounds/**").hasRole("ADMIN")
//
//                // Other GET endpoints for logged-in users only
//                .requestMatchers(HttpMethod.GET, "/api/grounds/**").hasAnyRole("USER", "ADMIN")
//
//                // Bookings endpoints
//                .requestMatchers(HttpMethod.GET, "/api/bookings/**").hasAnyRole("USER", "ADMIN")
//                .requestMatchers(HttpMethod.POST, "/api/bookings/**").hasRole("USER")
//                .requestMatchers(HttpMethod.DELETE, "/api/bookings/**").hasRole("ADMIN")
            
            
            .authorizeHttpRequests(auth -> auth
            	    // Allow CORS preflight
            	    .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

            	    // Swagger
            	    .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()

            	    // ✅ Make findGroundById public for internal calls
            	    .requestMatchers(HttpMethod.GET, "/api/grounds/findGroundById/**").permitAll()

            	    // Public getAllGrounds
            	    .requestMatchers(HttpMethod.GET, "/api/grounds/getAllGrounds").permitAll()

            	    // Admin CRUD
            	    .requestMatchers(HttpMethod.POST, "/api/grounds/**").hasRole("ADMIN")
            	    .requestMatchers(HttpMethod.PUT, "/api/grounds/**").hasRole("ADMIN")
            	    .requestMatchers(HttpMethod.DELETE, "/api/grounds/**").hasRole("ADMIN")

            	    // Other GET endpoints for logged-in users
            	    .requestMatchers(HttpMethod.GET, "/api/grounds/**").hasAnyRole("USER", "ADMIN")

            	    // Bookings
            	    .requestMatchers(HttpMethod.GET, "/api/bookings/**").hasAnyRole("USER", "ADMIN")
            	    .requestMatchers(HttpMethod.POST, "/api/bookings/**").hasRole("USER")
            	    .requestMatchers(HttpMethod.DELETE, "/api/bookings/**").hasRole("ADMIN")
            	

            )

            .httpBasic(httpBasic -> httpBasic.disable())
            .formLogin(formLogin -> formLogin.disable())
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
